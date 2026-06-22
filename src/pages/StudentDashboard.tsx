import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Heart, User, MessageSquare, Settings, Search, ArrowRight, Check, Edit3,
  MapPin, type LucideIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Input, Textarea, Select } from '../components/ui/Input';
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
import { computeMatch, topMatchReasons } from '../hooks/useMatchScore';
import type {MatchBreakdown, Student, University} from '../types';

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles, heart: Heart, user: User, message: MessageSquare, settings: Settings,
};

function profileCompleteness(s: Student) {
  const fields = ['name', 'age', 'country', 'gpa', 'sat', 'highSchool', 'graduationYear', 'careerGoal'] as const;
  const arrays = ['preferredMajors', 'preferredLocations', 'campusVibes', 'extracurriculars'] as const;
  const total = fields.length + arrays.length;
  let done = 0;
  fields.forEach((f) => { const v = s[f]; if (v !== '' && v != null) done++; });
  arrays.forEach((f) => { if (Array.isArray(s[f]) && s[f].length) done++; });
  return Math.round((done / total) * 100);
}

function UniversityCard({ uni, student, saved, onSave, onView, index }: {
  uni: University; student: Student; saved: boolean; onSave: () => void; onView: () => void; index: number;
}) {
  const { score, breakdown } = useMemo(() => computeMatch(student, uni), [student, uni]);
  const reasons = useMemo(() => topMatchReasons(student, uni, breakdown), [student, uni, breakdown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      <Card className="match-card">
        <div className="match-card-head">
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: uni.logoColor,
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0,
          }}>{uni.short}</div>
          <div className="match-card-title">
            <div className="match-card-name">{uni.name}</div>
            <div className="match-card-meta">
              <MapPin size={11} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              {uni.location} · {uni.size} · {uni.enrollment.toLocaleString()} students
            </div>
          </div>
          <CircularScore value={score} size={64} stroke={5} />
        </div>

        <div className="match-card-badges">
          {reasons.map((r, i) => <Badge key={i} tone={r.tone}>{r.label}</Badge>)}
        </div>

        <div className="match-card-stats">
          <div className="match-card-stat">
            <div className="match-card-stat-label">Acceptance</div>
            <div className="match-card-stat-val">{uni.acceptanceRate}%</div>
          </div>
          <div className="match-card-stat">
            <div className="match-card-stat-label">Avg GPA</div>
            <div className="match-card-stat-val">{uni.avgGpa.toFixed(2)}</div>
          </div>
          <div className="match-card-stat">
            <div className="match-card-stat-label">Tuition</div>
            <div className="match-card-stat-val">${(uni.tuition / 1000).toFixed(0)}k</div>
          </div>
        </div>

        <div className="match-card-foot">
          <button className={`icon-btn ${saved ? 'icon-btn-active' : ''}`} onClick={onSave} title="Save">
            <Heart size={16} strokeWidth={saved ? 2.2 : 1.8} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <Button size="sm" onClick={onView} iconRight={<ArrowRight size={14} />}>View profile</Button>
        </div>
      </Card>
    </motion.div>
  );
}

function Breakdown({ breakdown, labels }: { breakdown: MatchBreakdown; labels: Record<string, string> }) {
  return (
    <div className="breakdown">
      {Object.entries(breakdown).map(([k, v]) => (
        <div key={k} className="bd-row">
          <div className="bd-head">
            <span className="mute">{labels[k] || k}</span>
            <span style={{ color: v >= 80 ? '#22c55e' : v >= 60 ? '#f59e0b' : v >= 40 ? '#fde68a' : '#ef4444' }}>
              {v}%
            </span>
          </div>
          <ProgressBar value={v}
            color={v >= 80 ? 'linear-gradient(90deg,#16a34a,#22c55e)' :
                   v >= 60 ? 'linear-gradient(90deg,#d97706,#f59e0b)' :
                   'linear-gradient(90deg,#dc2626,#ef4444)'} />
        </div>
      ))}
    </div>
  );
}

function UniversityProfilePanel({ uni, student, open, onClose }: {
  uni: University | null; student: Student; open: boolean; onClose: () => void;
}) {
  if (!uni) return null;
  const { score, breakdown } = computeMatch(student, uni);
  return (
    <Panel open={open} onClose={onClose}>
      <div className="panel-hero">
        <div style={{
          width: 78, height: 78, borderRadius: 18, background: uni.logoColor,
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 26,
          boxShadow: '0 12px 24px -8px rgba(0,0,0,0.5)',
        }}>{uni.short}</div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <div className="h3" style={{ fontSize: 22 }}>{uni.name}</div>
          <div className="mute" style={{ marginTop: 4 }}>{uni.location}</div>
          <div style={{ marginTop: 10, fontSize: 14, fontStyle: 'italic', color: 'var(--text-2)' }}>"{uni.tagline}"</div>
        </div>
        <CircularScore value={score} size={84} stroke={6} />
      </div>

      <div className="panel-body">
        <div className="stats-row">
          <Card className="stat-card"><div className="stat-val">{uni.acceptanceRate}%</div><div className="stat-label">Acceptance</div></Card>
          <Card className="stat-card"><div className="stat-val">{uni.avgGpa.toFixed(2)}</div><div className="stat-label">Avg GPA</div></Card>
          <Card className="stat-card"><div className="stat-val">${(uni.tuition / 1000).toFixed(0)}k</div><div className="stat-label">Tuition</div></Card>
          <Card className="stat-card"><div className="stat-val">{(uni.enrollment / 1000).toFixed(0)}k</div><div className="stat-label">Enrollment</div></Card>
        </div>

        <div>
          <div className="h4" style={{ marginBottom: 12 }}>Programs offered</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {uni.programs.map((p) => <span key={p} className="chip" style={{ cursor: 'default' }}>{p}</span>)}
          </div>
        </div>

        <div>
          <div className="h4" style={{ marginBottom: 12 }}>Campus vibe</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {uni.campusVibes.map((v) => {
              const shared = student.campusVibes.includes(v);
              return <span key={v} className={`chip ${shared ? 'chip-selected' : ''}`} style={{ cursor: 'default' }}>{v}</span>;
            })}
          </div>
        </div>

        <Card style={{ padding: 22 }}>
          <div className="h4" style={{ marginBottom: 14 }}>How you match</div>
          <Breakdown breakdown={ breakdown }
            labels={{ academics: 'Academics', budget: 'Budget', major: 'Major fit', vibe: 'Campus vibe', location: 'Location' }} />
        </Card>

        {uni.scholarships && (
          <Card style={{
            padding: 18, display: 'flex', gap: 14, alignItems: 'center',
            border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.07)',
          }}>
            <Sparkles size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Scholarships available</div>
              <div className="mute text-sm">Merit and need-based aid for qualified applicants.</div>
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <Button block iconRight={<ArrowRight size={16} />}>Request info</Button>
          <Button variant="ghost" icon={<Heart size={16} />}>Save</Button>
        </div>
      </div>
    </Panel>
  );
}

function MyMatchesTab({ student, saved, setSaved, openUni }: {
  student: Student; saved: Set<string>; setSaved: (s: Set<string>) => void; openUni: (u: University) => void;
}) {
  const [loc, setLoc] = useState('');
  const [maj, setMaj] = useState('');
  const [sz, setSz] = useState('');
  const [tuitionMax, setTuitionMax] = useState(80000);

  const scored = useMemo(
    () => mockUniversities.map((u) => ({ uni: u, ...computeMatch(student, u) }))
      .sort((a, b) => b.score - a.score),
    [student],
  );

  const filtered = scored.filter(({ uni }) =>
    (!loc || uni.location === loc) &&
    (!maj || uni.programs.includes(maj)) &&
    (!sz || uni.size === sz) &&
    uni.tuition <= tuitionMax,
  );

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="filter-bar">
        <Search size={16} />
        <span className="mute text-sm" style={{ marginRight: 6 }}>Filter</span>
        <Select label="Location" value={loc} onChange={setLoc} options={[...new Set(mockUniversities.map((u) => u.location))]} />
        <Select label="Major" value={maj} onChange={setMaj} options={MAJORS} />
        <Select label="Size" value={sz} onChange={setSz} options={['Small', 'Medium', 'Large']} />
        <div className="field" style={{ minWidth: 200 }}>
          <label>Max tuition</label>
          <RangeSlider min={20000} max={80000} step={1000} value={tuitionMax} onChange={setTuitionMax}
            format={(v) => `$${(v / 1000).toFixed(0)}k`} />
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}
          onClick={() => { setLoc(''); setMaj(''); setSz(''); setTuitionMax(80000); }}>Reset</button>
      </div>

      <div className="mute text-sm">
        Showing {filtered.length} of {mockUniversities.length} universities, sorted by match score.
      </div>

      <div className="match-grid">
        {filtered.map(({ uni }, i) => (
          <UniversityCard key={uni.id} uni={uni} student={student} index={i}
            saved={saved.has(uni.id)}
            onSave={() => {
              const next = new Set(saved);
              if (next.has(uni.id)) next.delete(uni.id); else next.add(uni.id);
              setSaved(next);
            }}
            onView={() => openUni(uni)} />
        ))}
        {filtered.length === 0 && (
          <Card style={{ padding: 40, textAlign: 'center', gridColumn: '1/-1' }}>
            <div className="h3">No matches with those filters</div>
            <div className="mute" style={{ marginTop: 8 }}>Try loosening a filter or two.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

function SavedTab({ student, saved, setSaved, openUni }: {
  student: Student; saved: Set<string>; setSaved: (s: Set<string>) => void; openUni: (u: University) => void;
}) {
  const list = mockUniversities.filter((u) => saved.has(u.id));
  if (list.length === 0) return (
    <Card style={{ padding: 40, textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, margin: '0 auto 14px', borderRadius: '50%',
        background: 'rgba(239,68,68,0.15)', display: 'grid', placeItems: 'center', color: '#fca5a5',
      }}><Heart size={24} /></div>
      <div className="h3">No saved schools yet</div>
      <div className="mute" style={{ marginTop: 8 }}>Tap the heart on any match to save it here.</div>
    </Card>
  );
  return (
    <div className="match-grid">
      {list.map((uni, i) => (
        <UniversityCard key={uni.id} uni={uni} student={student} index={i} saved
          onSave={() => { const next = new Set(saved); next.delete(uni.id); setSaved(next); }}
          onView={() => openUni(uni)} />
      ))}
    </div>
  );
}

function MyProfileTab({ student, setStudent }: { student: Student; setStudent: (s: Student) => void }) {
  const [edit, setEdit] = useState(false);
  const complete = profileCompleteness(student);
  const set = (patch: Partial<Student>) => setStudent({ ...student, ...patch });

  return (
    <div className="col" style={{ gap: 20 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div className="mute text-sm">Profile completeness</div>
            <div className="h2" style={{ marginTop: 4 }}>{complete}%</div>
            <div style={{ marginTop: 14 }}><ProgressBar value={complete} /></div>
            <div className="mute text-sm" style={{ marginTop: 10 }}>
              {complete < 100
                ? `Complete your profile to get ${100 - complete}% more accurate matches.`
                : 'Your profile is complete. Universities are seeing the full picture.'}
            </div>
          </div>
          <Button variant="ghost" icon={edit ? <Check size={16} /> : <Edit3 size={16} />}
            onClick={() => setEdit(!edit)}>{edit ? 'Save changes' : 'Edit profile'}</Button>
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar name={student.name || 'Student'} size={68} />
          <div>
            {edit
              ? <Input value={student.name} onChange={(v) => set({ name: v })} placeholder="Your name" />
              : <div className="h2">{student.name || 'Add your name'}</div>}
            <div className="mute" style={{ marginTop: 4 }}>
              Age {student.age || '—'} · {student.country || '—'} · Graduating {student.graduationYear || '—'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {edit ? (
            <>
              <Input label="High school" value={student.highSchool || ''} onChange={(v) => set({ highSchool: v })} />
              <RangeSlider label="GPA" min={0} max={4} step={0.01} value={Number(student.gpa) || 0}
                onChange={(v) => set({ gpa: v })} format={(v) => v.toFixed(2)} />
              <Input label="SAT score" type="number" value={student.sat ?? ''} onChange={(v) => set({ sat: v })} />
            </>
          ) : (
            <>
              <Stat label="High school" value={student.highSchool || '—'} />
              <Stat label="GPA" value={Number(student.gpa).toFixed(2)} />
              <Stat label="SAT" value={String(student.sat) || '—'} />
              <Stat label="Class rank" value={student.classRank || '—'} />
              <Stat label="Intended major" value={student.major || student.preferredMajors?.[0] || '—'} />
              <Stat label="Budget" value={`$${(student.budgetRange[0] / 1000).toFixed(0)}k – $${(student.budgetRange[1] / 1000).toFixed(0)}k`} />
            </>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

        <div className="col" style={{ gap: 18 }}>
          <ChipBlock label="Preferred majors" options={MAJORS} value={student.preferredMajors} edit={edit} onChange={(v) => set({ preferredMajors: v })} />
          <ChipBlock label="Preferred locations" options={LOCATIONS} value={student.preferredLocations} edit={edit} onChange={(v) => set({ preferredLocations: v })} />
          <ChipBlock label="Campus vibe" options={[...VIBE_TAGS]} value={student.campusVibes} edit={edit} onChange={(v) => set({ campusVibes: v })} />
          <ChipBlock label="Extracurriculars" options={ACTIVITIES} value={student.extracurriculars} edit={edit} onChange={(v) => set({ extracurriculars: v })} />
          <div>
            <div className="mute text-sm" style={{ marginBottom: 8 }}>Career goal</div>
            {edit
              ? <Textarea value={student.careerGoal} onChange={(v) => set({ careerGoal: v })} />
              : <div style={{ fontSize: 15, lineHeight: 1.6 }}>{student.careerGoal || '—'}</div>}
          </div>
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

function MessagesPlaceholder() {
  return (
    <Card style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="h3">Inbox</div>
      {['Cascadia Institute of Technology', 'Harborlight University', 'Lakeshore College'].map((n, i) => (
        <div key={n} style={{
          display: 'flex', gap: 14, padding: 16, borderRadius: 14,
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: ['linear-gradient(135deg,#2563eb,#06b6d4)', 'linear-gradient(135deg,#1d4ed8,#6366f1)', 'linear-gradient(135deg,#0ea5e9,#6366f1)'][i],
            display: 'grid', placeItems: 'center', fontWeight: 700,
          }}>{n.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600 }}>{n}</div>
              <div className="mute text-xs">{['2h ago', 'Yesterday', '3d ago'][i]}</div>
            </div>
            <div className="mute text-sm" style={{ marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {[
                'Thanks for the strong application — would love to chat about our research opportunities.',
                'We\'d like to invite you to an admitted-students virtual tour next week.',
                'Quick question about your portfolio for the design program.',
              ][i]}
            </div>
          </div>
          {i === 0 && <Badge tone="blue">New</Badge>}
        </div>
      ))}
      <Button variant="ghost" block>Open all conversations</Button>
    </Card>
  );
}

function SettingsTab() {
  return (
    <Card style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="h3">Settings</div>
      {[
        { label: 'Email notifications for new matches', val: true },
        { label: 'Allow universities to message you directly', val: true },
        { label: 'Share my profile with partner organizations', val: false },
        { label: 'Show me in the public discovery feed', val: true },
      ].map((s, i) => <SettingRow key={i} {...s} />)}
    </Card>
  );
}

function SettingRow({ label, val }: { label: string; val: boolean }) {
  const [v, setV] = useState(val);
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>{label}</div>
      <Toggle value={v} onChange={setV} />
    </div>
  );
}

const navItems = [
  { key: 'matches', label: 'My Matches', icon: 'sparkles' },
  { key: 'saved', label: 'Saved', icon: 'heart' },
  { key: 'profile', label: 'My Profile', icon: 'user' },
  { key: 'messages', label: 'Messages', icon: 'message', badge: 3 },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('matches');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [activeUni, setActiveUni] = useState<University | null>(null);

  const [student, setStudent] = useState<Student>(() => {
    try {
      const raw = localStorage.getItem('um.student');
      if (raw) {
        const p = JSON.parse(raw);
        return {
          ...mockStudents[0],
          ...p,
          gpa: Number(p.gpa) || 3.7,
          major: p.major || p.preferredMajors?.[0] || 'Computer Science',
          preferredMajors: p.preferredMajors?.length ? p.preferredMajors : ['Computer Science'],
          preferredLocations: p.preferredLocations?.length ? p.preferredLocations : ['Boston, MA', 'Seattle, WA'],
          campusVibes: p.campusVibes?.length ? p.campusVibes : ['Research-Focused', 'Tech Hub'],
          extracurriculars: p.extracurriculars?.length ? p.extracurriculars : ['Coding Club'],
        } as Student;
      }
    } catch { /* ignore */ }
    return { ...mockStudents[0] };
  });

  useEffect(() => {
    try { localStorage.setItem('um.student', JSON.stringify(student)); } catch { /* ignore */ }
  }, [student]);

  const nav = navItems.map((n) => n.key === 'saved' ? { ...n, badge: saved.size || null } : n);

  const header: Record<string, { title: string; sub: string }> = {
    matches: { title: 'Your matches', sub: 'Universities sorted by how well they fit you, today.' },
    saved: { title: 'Saved', sub: "The schools you're considering most carefully." },
    profile: { title: 'My Profile', sub: 'What universities see when they look you up.' },
    messages: { title: 'Messages', sub: 'Conversations with admissions teams.' },
    settings: { title: 'Settings', sub: 'Account and notification preferences.' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TopNav
        name={student.name || 'Student'}
        subtitle={student.major || student.preferredMajors?.[0] || 'Applicant'}
        iconMap={iconMap} nav={nav} current={tab} onNav={setTab}
        onBack={() => navigate('/')}
        badge={<Badge>{mockUniversities.length} active matches</Badge>}
        title={header[tab].title}
        hint={header[tab].sub}
      />

      <main className="main">
        {tab === 'matches' && <MyMatchesTab student={student} saved={saved} setSaved={setSaved} openUni={setActiveUni} />}
        {tab === 'saved' && <SavedTab student={student} saved={saved} setSaved={setSaved} openUni={setActiveUni} />}
        {tab === 'profile' && <MyProfileTab student={student} setStudent={setStudent} />}
        {tab === 'messages' && <MessagesPlaceholder />}
        {tab === 'settings' && <SettingsTab />}

        <UniversityProfilePanel uni={activeUni} student={student} open={!!activeUni} onClose={() => setActiveUni(null)} />
      </main>
    </motion.div>
  );
}
