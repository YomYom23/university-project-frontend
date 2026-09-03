import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
   Star, User, BarChart3, Settings, ArrowRight, Check, Edit3,
  MapPin, Building2, type LucideIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Input';
import ProgressBar from '../components/ui/ProgressBar';
import CircularScore from '../components/ui/CircularScore';
import { RangeSlider } from '../components/ui/RangeSlider';
import MultiChipSelect from '../components/ui/MultiChipSelect';
import Panel from '../components/ui/Panel';
import Toggle from '../components/ui/Toggle';
import TopNav from '../components/layout/TopNav';
import { mockUniversities } from '../data/mockUniversities';
import { mockStudents } from '../data/mockStudents';
import { MAJORS, LOCATIONS, VIBE_TAGS, ACTIVITIES } from '../data/options';
import { computeMatch, topMatchReasonsForStudent } from '../hooks/useMatchScore';
import type { Student, University } from '../types';

const iconMap: Record<string, LucideIcon> = {
  bar: BarChart3, user: User, star: Star, building: Building2, settings: Settings,
};

const avatarGradients = [
  'linear-gradient(135deg,#2563eb,#06b6d4)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#ec4899,#f97316)',
  'linear-gradient(135deg,#10b981,#14b8a6)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
];

function StudentCard({ student, uni, shortlisted, onStar, onView, index }: {
  student: Student; uni: University; shortlisted: boolean; onStar: () => void; onView: () => void; index: number;
}) {
  const { score, breakdown } = useMemo(() => computeMatch(student, uni), [student, uni]);
  const reasons = useMemo(() => topMatchReasonsForStudent(student, uni, breakdown), [student, uni, breakdown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      <Card className="match-card">
        <div className="match-card-head">
          <Avatar name={student.name} size={52} gradient={avatarGradients[index % avatarGradients.length]} />
          <div className="match-card-title">
            <div className="match-card-name">{student.name}</div>
            <div className="match-card-meta">
              <MapPin size={11} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              {student.country} · Class of {student.graduationYear}
            </div>
          </div>
          <CircularScore value={score} size={64} stroke={5} />
        </div>

        <div className="match-card-badges">
          {reasons.map((r, i) => <Badge key={i} tone={r.tone}>{r.label}</Badge>)}
        </div>

        <div className="match-card-stats">
          <div className="match-card-stat">
            <div className="match-card-stat-label">GPA</div>
            <div className="match-card-stat-val">{Number(student.gpa).toFixed(2)}</div>
          </div>
          <div className="match-card-stat">
            <div className="match-card-stat-label">SAT</div>
            <div className="match-card-stat-val">{student.satScore}</div>
          </div>
          <div className="match-card-stat">
            <div className="match-card-stat-label">Major</div>
            <div className="match-card-stat-val" style={{ fontSize: 13 }}>{student.major}</div>
          </div>
        </div>

        <div style={{
          fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5,
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
        }}>"{student.careerGoal}"</div>

        <div className="match-card-foot">
          <button className={`icon-btn ${shortlisted ? 'icon-btn-active-star' : ''}`} onClick={onStar} title="Shortlist">
            <Star size={16} strokeWidth={shortlisted ? 2.2 : 1.8} fill={shortlisted ? 'currentColor' : 'none'} />
          </button>
          <Button size="sm" onClick={onView} iconRight={<ArrowRight size={14} />}>View profile</Button>
        </div>
      </Card>
    </motion.div>
  );
}

function StudentProfilePanel({ student, uni, open, onClose }: {
  student: Student | null; uni: University; open: boolean; onClose: () => void;
}) {
  if (!student) return null;
  const { score, breakdown } = computeMatch(student, uni);
  return (
    <Panel open={open} onClose={onClose}>
      <div className="panel-hero">
        <Avatar name={student.name} size={78} gradient="linear-gradient(135deg,#2563eb,#06b6d4)" />
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <div className="h3" style={{ fontSize: 22 }}>{student.name}</div>
          <div className="mute" style={{ marginTop: 4 }}>
            Age {student.age} · {student.country} · Class of {student.graduationYear}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Badge tone="blue">{student.major}</Badge>
            {student.highSchool && <Badge>{student.highSchool}</Badge>}
            {student.classRank && <Badge>Rank {student.classRank}</Badge>}
          </div>
        </div>
        <CircularScore value={score} size={84} stroke={6} />
      </div>

      <div className="panel-body">
        <div className="stats-row">
          <Card className="stat-card"><div className="stat-val">{Number(student.gpa).toFixed(2)}</div><div className="stat-label">GPA</div></Card>
          <Card className="stat-card"><div className="stat-val">{student.satScore}</div><div className="stat-label">SAT</div></Card>
          <Card className="stat-card"><div className="stat-val">{student.graduationYear}</div><div className="stat-label">Grad year</div></Card>
          <Card className="stat-card"><div className="stat-val">${(student.budgetRange[1] / 1000).toFixed(0)}k</div><div className="stat-label">Budget ceiling</div></Card>
        </div>

        <Card style={{ padding: 22 }}>
          <div className="h4" style={{ marginBottom: 6 }}>Career goal</div>
          <div style={{ fontSize: 15, lineHeight: 1.65 }}>"{student.careerGoal}"</div>
        </Card>

        <div>
          <div className="h4" style={{ marginBottom: 12 }}>Extracurriculars</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {student.extracurriculars.map((a) => {
              const valued = uni.preferredActivities.includes(a);
              return <span key={a} className={`chip ${valued ? 'chip-selected' : ''}`} style={{ cursor: 'default' }}>{a}</span>;
            })}
          </div>
        </div>

        <div>
          <div className="h4" style={{ marginBottom: 12 }}>Desired campus vibe</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {student.campusVibes.map((v) => {
              const shared = uni.campusVibes.includes(v);
              return <span key={v} className={`chip ${shared ? 'chip-selected' : ''}`} style={{ cursor: 'default' }}>{v}</span>;
            })}
          </div>
        </div>

        <Card style={{ padding: 22 }}>
          <div className="h4" style={{ marginBottom: 14 }}>Why this is a match</div>
          <div className="breakdown">
            {Object.entries(breakdown).map(([k, v]) => (
              <div key={k} className="bd-row">
                <div className="bd-head">
                  <span className="mute">{({
                    academics: 'Academics', budget: 'Budget alignment', major: 'Program fit',
                    vibe: 'Cultural fit', location: 'Location preference',
                  } as Record<string, string>)[k]}</span>
                  <span style={{ color: v >= 80 ? '#22c55e' : v >= 60 ? '#f59e0b' : v >= 40 ? '#fde68a' : '#ef4444' }}>{v}%</span>
                </div>
                <ProgressBar value={v}
                  color={v >= 80 ? 'linear-gradient(90deg,#16a34a,#22c55e)' :
                         v >= 60 ? 'linear-gradient(90deg,#d97706,#f59e0b)' :
                         'linear-gradient(90deg,#dc2626,#ef4444)'} />
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button block iconRight={<ArrowRight size={16} />}>Reach out</Button>
          <Button variant="ghost" icon={<Star size={16} />}>Shortlist</Button>
        </div>
      </div>
    </Panel>
  );
}

function CandidatePoolTab({ uni, shortlist, setShortlist, openStudent }: {
  uni: University; shortlist: Set<string>; setShortlist: (s: Set<string>) => void; openStudent: (s: Student) => void;
}) {
  const [q, setQ] = useState('');
  const [maj, setMaj] = useState('');
  const [loc, setLoc] = useState('');
  const [act, setAct] = useState('');
  const [gpaMin, setGpaMin] = useState(3.0);

  const scored = useMemo(
    () => mockStudents.map((s) => ({ s, ...computeMatch(s, uni) })).sort((a, b) => b.score - a.score),
    [uni],
  );

  const filtered = scored.filter(({ s }) =>
    (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.major.toLowerCase().includes(q.toLowerCase())) &&
    (!maj || s.major === maj) &&
    (!loc || s.preferredLocations.includes(loc)) &&
    s.gpa >= gpaMin &&
    (!act || s.extracurriculars.includes(act)),
  );

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="filter-bar">
        <div className="field" style={{ minWidth: 240 }}>
          <label>Search</label>
          <input className="input" style={{ padding: '8px 10px', fontSize: 13 }} value={q}
            onChange={(e) => setQ(e.target.value)} placeholder="Name or intended major..." />
        </div>
        <Select label="Major" value={maj} onChange={setMaj} options={MAJORS} />
        <Select label="Preferred location" value={loc} onChange={setLoc} options={LOCATIONS} />
        <Select label="Extracurricular" value={act} onChange={setAct} options={ACTIVITIES} />
        <div className="field" style={{ minWidth: 200 }}>
          <label>Min GPA</label>
          <RangeSlider min={2.5} max={4} step={0.05} value={gpaMin} onChange={setGpaMin} format={(v) => v.toFixed(2)} />
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}
          onClick={() => { setQ(''); setMaj(''); setLoc(''); setGpaMin(3.0); setAct(''); }}>Reset</button>
      </div>

      <div className="mute text-sm">
        {filtered.length} candidates match your criteria, sorted by fit to {uni.name || 'your university'}.
      </div>

      <div className="match-grid">
        {filtered.map(({ s }, i) => (
          <StudentCard key={s.id} student={s} uni={uni} index={i}
            shortlisted={shortlist.has(s.id)}
            onStar={() => {
              const next = new Set(shortlist);
              if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
              setShortlist(next);
            }}
            onView={() => openStudent(s)} />
        ))}
        {filtered.length === 0 && (
          <Card style={{ padding: 40, textAlign: 'center', gridColumn: '1/-1' }}>
            <div className="h3">No candidates match those filters</div>
            <div className="mute" style={{ marginTop: 8 }}>Widen your criteria to surface more students.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ShortlistTab({ uni, shortlist, setShortlist, openStudent }: {
  uni: University; shortlist: Set<string>; setShortlist: (s: Set<string>) => void; openStudent: (s: Student) => void;
}) {
  const list = mockStudents.filter((s) => shortlist.has(s.id));
  if (list.length === 0) return (
    <Card style={{ padding: 40, textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 14px', borderRadius: '50%',
        background: 'rgba(245,158,11,0.15)', display: 'grid', placeItems: 'center', color: '#fde68a',
      }}><Star size={24} /></div>
      <div className="h3">No shortlisted candidates yet</div>
      <div className="mute" style={{ marginTop: 8 }}>Star promising students from the candidate pool to track them here.</div>
    </Card>
  );
  return (
    <div className="match-grid">
      {list.map((s, i) => (
        <StudentCard key={s.id} student={s} uni={uni} index={i} shortlisted
          onStar={() => { const next = new Set(shortlist); next.delete(s.id); setShortlist(next); }}
          onView={() => openStudent(s)} />
      ))}
    </div>
  );
}

function OverviewTab({ uni, shortlist }: { uni: University; shortlist: Set<string> }) {
  const scored = mockStudents.map((s) => computeMatch(s, uni).score);
  const avg = Math.round(scored.reduce((a, b) => a + b, 0) / Math.max(1, scored.length));
  const high = scored.filter((s) => s >= 80).length;

  const buckets = [0, 0, 0, 0, 0];
  scored.forEach((s) => buckets[Math.min(4, Math.floor(s / 20))]++);
  const labels = ['0–20', '21–40', '41–60', '61–80', '81–100'];
  const max = Math.max(...buckets, 1);

  const majorCounts: Record<string, number> = {};
  mockStudents.forEach((s) => { majorCounts[s.major] = (majorCounts[s.major] || 0) + 1; });
  const items = Object.entries(majorCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const mmax = Math.max(...items.map(([, c]) => c));

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="stats-row">
        <Card className="stat-card"><div className="stat-val">{mockStudents.length}</div><div className="stat-label">Active candidates</div></Card>
        <Card className="stat-card"><div className="stat-val gradient-text">{avg}%</div><div className="stat-label">Avg match</div></Card>
        <Card className="stat-card"><div className="stat-val" style={{ color: '#22c55e' }}>{high}</div><div className="stat-label">Strong fits (80%+)</div></Card>
        <Card className="stat-card"><div className="stat-val" style={{ color: '#f59e0b' }}>{shortlist.size}</div><div className="stat-label">Shortlisted</div></Card>
      </div>

      <Card style={{ padding: 24 }}>
        <div className="h4" style={{ marginBottom: 16 }}>Match-score distribution</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {buckets.map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{b}</div>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(b / max) * 100}%` }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.08 }}
                style={{
                  width: '100%', minHeight: 4,
                  background: i >= 4 ? 'linear-gradient(180deg,#22c55e,#16a34a)' :
                              i >= 3 ? 'linear-gradient(180deg,#3b82f6,#1d4ed8)' :
                              i >= 2 ? 'linear-gradient(180deg,#f59e0b,#d97706)' :
                                       'linear-gradient(180deg,#ef4444,#dc2626)',
                  borderRadius: '8px 8px 4px 4px',
                }} />
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div className="h4" style={{ marginBottom: 16 }}>Top intended majors in your pool</div>
        <div className="col" style={{ gap: 10 }}>
          {items.map(([m, c]) => (
            <div key={m} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 32px', gap: 12, alignItems: 'center' }}>
              <div className="text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m}</div>
              <ProgressBar value={(c / mmax) * 100} />
              <div className="mute text-sm" style={{ textAlign: 'right' }}>{c}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UniProfileTab({ uni, setUni }: { uni: University; setUni: (u: University) => void }) {
  const [edit, setEdit] = useState(false);
  const set = (patch: Partial<University>) => setUni({ ...uni, ...patch });

  const complete = useMemo(() => {
    const fields = ['name', 'location', 'tagline', 'acceptanceRate', 'avgGpa', 'tuition'] as const;
    const arrays = ['programs', 'campusVibes', 'preferredMajors', 'preferredActivities'] as const;
    const total = fields.length + arrays.length;
    let done = 0;
    fields.forEach((f) => { const v = uni[f]; if (v !== '' && v != null) done++; });
    arrays.forEach((f) => { if (Array.isArray(uni[f]) && uni[f].length) done++; });
    return Math.round((done / total) * 100);
  }, [uni]);

  return (
    <div className="col" style={{ gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div className="mute text-sm">Profile completeness</div>
            <div className="h2" style={{ marginTop: 4 }}>{complete}%</div>
            <div style={{ marginTop: 14 }}><ProgressBar value={complete} /></div>
            <div className="mute text-sm" style={{ marginTop: 10 }}>
              {complete < 100 ? 'Complete your profile to surface to more students.' : 'Your profile is complete and visible.'}
            </div>
          </div>
          <Button variant="ghost" icon={edit ? <Check size={16} /> : <Edit3 size={16} />}
            onClick={() => setEdit(!edit)}>{edit ? 'Save changes' : 'Edit profile'}</Button>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: uni.logoColor, display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 22,
          }}>{uni.short}</div>
          <div style={{ flex: 1 }}>
            {edit
              ? <Input value={uni.name} onChange={(v) => set({ name: v })} placeholder="University name" />
              : <div className="h2">{uni.name || 'Add university name'}</div>}
            <div className="mute" style={{ marginTop: 4 }}>{uni.location || '—'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {edit ? (
            <>
              <Input label="Location" value={uni.location} onChange={(v) => set({ location: v })} />
              <Input label="Website" value={uni.website || ''} onChange={(v) => set({ website: v })} />
              <RangeSlider label="Acceptance rate" min={1} max={100} value={uni.acceptanceRate}
                onChange={(v) => set({ acceptanceRate: v })} format={(v) => `${v}%`} />
              <RangeSlider label="Avg GPA" min={2} max={4} step={0.01} value={uni.avgGpa}
                onChange={(v) => set({ avgGpa: v })} format={(v) => v.toFixed(2)} />
              <RangeSlider label="Tuition" min={5000} max={80000} step={1000} value={uni.tuition}
                onChange={(v) => set({ tuition: v })} format={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <RangeSlider label="Minimum GPA" min={2} max={4} step={0.01} value={uni.minGpaRequired}
                onChange={(v) => set({ minGpaRequired: v })} format={(v) => v.toFixed(2)} />
            </>
          ) : (
            <>
              <Stat label="Acceptance rate" value={`${uni.acceptanceRate}%`} />
              <Stat label="Avg GPA" value={uni.avgGpa.toFixed(2)} />
              <Stat label="Tuition" value={`$${(uni.tuition / 1000).toFixed(0)}k`} />
              <Stat label="Size" value={uni.size} />
              <Stat label="Min GPA" value={uni.minGpaRequired.toFixed(2)} />
              <Stat label="Scholarships" value={uni.scholarships ? 'Yes' : 'No'} />
            </>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

        <div>
          <div className="mute text-sm" style={{ marginBottom: 8 }}>Tagline</div>
          {edit
            ? <Textarea value={uni.tagline} onChange={(v) => set({ tagline: v })} />
            : <div style={{ fontSize: 16, fontStyle: 'italic' }}>"{uni.tagline || '—'}"</div>}
        </div>

        <div style={{ marginTop: 22 }} className="col gap-12">
          <ChipBlock label="Programs offered" options={MAJORS} value={uni.programs} edit={edit} onChange={(v) => set({ programs: v })} />
          <ChipBlock label="Campus vibe" options={[...VIBE_TAGS]} value={uni.campusVibes} edit={edit} onChange={(v) => set({ campusVibes: v })} />
          <ChipBlock label="Preferred majors (for matching)" options={MAJORS} value={uni.preferredMajors} edit={edit} onChange={(v) => set({ preferredMajors: v })} />
          <ChipBlock label="Valued activities" options={ACTIVITIES} value={uni.preferredActivities} edit={edit} onChange={(v) => set({ preferredActivities: v })} />
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mute text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function ChipBlock({ label, options, value, edit, onChange }: {
  label: string; options: string[]; value: string[]; edit: boolean; onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="mute text-sm" style={{ marginBottom: 8 }}>{label}</div>
      {edit
        ? <MultiChipSelect options={options} value={value} onChange={onChange} />
        : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {value?.length ? value.map((v) => <span key={v} className="chip chip-selected" style={{ cursor: 'default' }}>{v}</span>)
              : <span className="mute text-sm">—</span>}
          </div>}
    </div>
  );
}

function UniSettings() {
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState(true);
  const [s3, setS3] = useState(false);
  return (
    <Card style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="h3">Settings</div>
      {[
        { label: 'Email digest of new strong matches', v: s1, setV: setS1 },
        { label: 'Allow students to message us directly', v: s2, setV: setS2 },
        { label: 'Auto-shortlist students above 90% match', v: s3, setV: setS3 },
      ].map((r, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 0', borderBottom: '1px solid var(--border)',
        }}>
          <div>{r.label}</div>
          <Toggle value={r.v} onChange={r.setV} />
        </div>
      ))}
    </Card>
  );
}

const navItems = [
  { key: 'overview', label: 'Overview', icon: 'bar' },
  { key: 'candidates', label: 'Candidates', icon: 'user' },
  { key: 'saved', label: 'Shortlist', icon: 'star' },
  { key: 'profile', label: 'University Profile', icon: 'building' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export default function UniversityDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const [uni, setUni] = useState<University>(() => {
    try {
      const raw = localStorage.getItem('um.university');
      if (raw) {
        const p = JSON.parse(raw);
        return {
          ...mockUniversities[1],
          ...p,
          short: (p.name || 'UN').split(/\s+/).map((w: string) => w[0]).join('').slice(0, 3).toUpperCase(),
          enrollment: p.enrollment || 12000,
          logoColor: p.logoColor || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          programs: p.programs?.length ? p.programs : ['Computer Science', 'Business', 'Biology'],
          campusVibes: p.campusVibes?.length ? p.campusVibes : ['Research-Focused', 'City Life'],
          preferredMajors: p.preferredMajors?.length ? p.preferredMajors : ['Computer Science'],
          preferredActivities: p.preferredActivities?.length ? p.preferredActivities : ['Coding Club'],
        } as University;
      }
    } catch { /* ignore */ }
    return { ...mockUniversities[1] };
  });

  useEffect(() => {
    try { localStorage.setItem('um.university', JSON.stringify(uni)); } catch { /* ignore */ }
  }, [uni]);

  const nav = navItems.map((n) => n.key === 'saved' ? { ...n, badge: shortlist.size || null } : n);

  const header: Record<string, { title: string; sub: string }> = {
    overview: { title: 'Welcome back', sub: `Here's how ${uni.name || 'your university'} is showing up to students.` },
    candidates: { title: 'Candidate pool', sub: 'Students sorted by fit. Filter, shortlist, and reach out.' },
    saved: { title: 'Shortlist', sub: "Students you're tracking for outreach." },
    profile: { title: 'University profile', sub: 'How you appear to students searching for a match.' },
    settings: { title: 'Settings', sub: 'Account and notification preferences.' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TopNav
        name={uni.name || 'University'}
        subtitle={uni.location || '—'}
        gradient={uni.logoColor || 'linear-gradient(135deg, #6366f1, #8b5cf6)'}
        iconMap={iconMap} nav={nav} current={tab} onNav={setTab}
        onBack={() => navigate('/')}
        badge={<Badge>{mockStudents.length} active candidates</Badge>}
        title={header[tab].title}
        hint={header[tab].sub}
      />

      <main className="main">
        {tab === 'overview' && <OverviewTab uni={uni} shortlist={shortlist} />}
        {tab === 'candidates' && <CandidatePoolTab uni={uni} shortlist={shortlist} setShortlist={setShortlist} openStudent={setActiveStudent} />}
        {tab === 'saved' && <ShortlistTab uni={uni} shortlist={shortlist} setShortlist={setShortlist} openStudent={setActiveStudent} />}
        {tab === 'profile' && <UniProfileTab uni={uni} setUni={setUni} />}
        {tab === 'settings' && <UniSettings />}

        <StudentProfilePanel student={activeStudent} uni={uni} open={!!activeStudent} onClose={() => setActiveStudent(null)} />
      </main>
    </motion.div>
  );
}
