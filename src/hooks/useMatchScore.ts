import { useMemo } from 'react';
import type {Student, University, MatchResult} from '../types';


export function computeMatch(student: Student, uni: University): MatchResult {
  // GPA — 25 pts
  let academics;
  if (student.gpa >= uni.minGpaRequired) {
    const delta = Math.abs(student.gpa - uni.avgGpa);
    academics = Math.max(0, 25 - delta * 40);
  } else {
    academics = Math.max(0, 12 - (uni.minGpaRequired - student.gpa) * 30);
  }

  // Budget — 25 pts
  const [lo, hi] = student.budgetRange;
  let budget;
  if (uni.tuition <= hi && uni.tuition >= lo) budget = 25;
  else if (uni.tuition < lo) budget = 22;
  else {
    const over = uni.tuition - hi;
    budget = Math.max(0, 25 - (over / 1000) * 1.4);
  }

  // Major — 20 pts
  let major = 0;
  if (uni.programs.includes(student.major)) major = 18;
  if (uni.preferredMajors.includes(student.major)) major = 20;

  // Vibe — 15 pts
  const sharedVibes = student.campusVibes.filter((v) => uni.campusVibes.includes(v));
  const vibe = Math.min(15, sharedVibes.length * 6);

  // Location — 15 pts
  const location = student.preferredLocations.includes(uni.location)
      ? 15
      : student.preferredLocations.some(
          (loc) => loc.split(',')[1]?.trim() === uni.location.split(',')[1]?.trim(),
      )
          ? 8
          : 0;

  const score = Math.round(academics + budget + major + vibe + location);
  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      "academics": Math.round((academics / 25) * 100),
      "budget": Math.round((budget / 25) * 100),
      "major": Math.round((major / 20) * 100),
     "vibe": Math.round((vibe / 15) * 100),
      "location": Math.round((location / 15) * 100),
    },
  };
}

export function useMatchScore(student: Student, uni: University): MatchResult {
  return useMemo(() => computeMatch(student, uni), [student, uni]);
}

export interface MatchReason { label: string; tone: 'blue' | 'green' | 'amber' | 'red' }

export function topMatchReasons(
    student: Student, uni: University, breakdown: MatchResult['breakdown'],
): MatchReason[] {
  const reasons: MatchReason[] = [];
  if (breakdown.major >= 90) reasons.push({ label: `${student.major} program`, tone: 'blue' });
  else if (breakdown.major >= 70) reasons.push({ label: 'Major available', tone: 'blue' });
  if (breakdown.budget >= 90) reasons.push({ label: 'In your budget', tone: 'green' });
  else if (breakdown.budget >= 60) reasons.push({ label: 'Near budget', tone: 'amber' });
  if (breakdown.academics >= 80) reasons.push({ label: 'GPA in range', tone: 'green' });
  const sharedVibes = student.campusVibes.filter((v) => uni.campusVibes.includes(v));
  if (sharedVibes.length >= 1) reasons.push({ label: `${sharedVibes[0]} vibe`, tone: 'blue' });
  if (breakdown.location >= 90) reasons.push({ label: 'In a city you love', tone: 'green' });
  return reasons.slice(0, 3);
}

export function topMatchReasonsForStudent(
    student: Student, uni: University, breakdown: MatchResult['breakdown'],
): MatchReason[] {
  const reasons: MatchReason[] = [];
  if (breakdown.academics >= 80) reasons.push({ label: 'Strong academic fit', tone: 'green' });
  if (breakdown.major >= 90) reasons.push({ label: `Wants ${student.major}`, tone: 'blue' });
  const sharedActs = student.extracurriculars.filter((a) => uni.preferredActivities.includes(a));
  if (sharedActs.length) reasons.push({ label: `${sharedActs[0]} background`, tone: 'blue' });
  if (breakdown.vibe >= 70) reasons.push({ label: 'Culture aligned', tone: 'blue' });
  if (breakdown.location >= 90) reasons.push({ label: 'Local to campus', tone: 'green' });
  return reasons.slice(0, 3);
}
