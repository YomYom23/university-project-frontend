// Shared types
import type {Dispatch, SetStateAction} from "react";

export type Vibe =
    | 'Research-Focused' | 'Liberal Arts' | 'Sports Culture' | 'City Life'
    | 'Rural Campus' | 'Tech Hub' | 'Creative Arts' | 'Greek Life'
    | 'Diverse Community' | 'Outdoorsy' | 'International' | 'Tight-Knit';

export type Size = 'Small' | 'Medium' | 'Large';

export interface User {
    id: string;
    role: 'student' | 'university';
    onboardingStep: number;
    email?: string;
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
    gpa: number;
    satScore: number | string;
    act?: number | string;
    major: string;
    highSchool?: string;
    graduationYear: number;
    classRank?: string;
    preferredMajors: string[];
    preferredLocations: string[];
    size?: Size;
    budgetRange: [number, number];
    campusVibes: string[];
    extracurriculars: string[];
    careerGoal: string;
    priority?: string;
}

export interface University {
    id: string;
    name: string;
    short: string;
    location: string;
    website?: string;
    founded?: number | string;
    tagline: string;
    acceptanceRate: number;
    avgGpa: number;
    tuition: number;
    size: Size;
    enrollment: number;
    programs: string[];
    campusVibes: string[];
    scholarships: boolean;
    scholarshipDetails?: string;
    minGpaRequired: number;
    preferredMajors: string[];
    preferredActivities: string[];
    specialPrograms?: string;
    logoColor: string;
}

export interface MatchBreakdown {
    academics: number;
    budget: number;
    major: number;
    vibe: number;
    location: number;
}

export interface MatchResult {
    score: number;
    breakdown: MatchBreakdown;
}

export interface NavItem {
    key: string;
    label: string;
    icon: string;
    badge?: number | null;
}

export type StudentForm = Partial<Student> & {
    preferredMajors: string[]; preferredLocations: string[]; campusVibes: string[];
    extracurriculars: string[]; budgetRange: [number, number]; gpa: number;
    // Fields below are informed by the college-fit data taxonomy (A2, A3, B6, B7, B10):
    // GPA/test values are only comparable with context, so we capture that context
    // instead of a bare number, and cost/support signals are collected early (cost-first).
    //
    // None of these have a StudentProfile column, so they stay client-side —
    // src/api/onboarding.ts does not send them.
    gpaScale: 'Weighted' | 'Unweighted';
    submittingScores: boolean;
    settingPreference: string[];
    distanceTolerance: number;
    needsFinancialAid: boolean;
    supportNeeds: string[];
    riskTolerance: 'Mostly safety' | 'Balanced list' | 'Reach-heavy';
};

export type UniForm = Partial<University> & {
    programs: string[]; campusVibes: string[]; preferredMajors: string[]; preferredActivities: string[];
    // Fields below reflect the taxonomy's highest-value, most-requested college-side signals
    // (A3 test policy, B2 need-met %, B5 Pell % as a socioeconomic-diversity proxy, A10 demonstrated interest).
    testPolicy: 'Required' | 'Test-optional' | 'Test-free';
    needMetPercent: number;
    pellPercent: number;
    tracksDemonstratedInterest: boolean;
    firstGenSupport: boolean;
};

export interface AuthContextType {
    // Null while signed out, and before the first /auth/status call resolves.
    // Guard on `isLoading` first, as ProtectedRoute does.
    user: User | null;
    isLoading: boolean;
    // Use the named React types (Dispatch/SetStateAction). Referencing the
    // `React.*` namespace fails here because verbatimModuleSyntax + react-jsx
    // means there is no global `React` unless it is explicitly imported.
    setUser: Dispatch<SetStateAction<User | null>>;
    // Re-checks /auth/status and refreshes `user`. Call after login/signup so
    // the context picks up the new session cookie.
    refreshUser: () => Promise<void>;
}