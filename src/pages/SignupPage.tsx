import { useMemo, useState, type ReactNode, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Segmented from '../components/ui/Segmented';
import { useAuth } from '../hooks/useAuth';

type Role = 'student' | 'university';

const ROLE_COPY: Record<Role, { nameLabel: string; namePlaceholder: string; emailPlaceholder: string }> = {
    student: { nameLabel: 'Full name', namePlaceholder: 'Aria Patel', emailPlaceholder: 'you@school.edu' },
    university: { nameLabel: 'University name', namePlaceholder: 'Cascadia Institute of Technology', emailPlaceholder: 'admissions@cit.edu' },
};

function passwordScore(pw: string): number {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0–4
}
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

function Field({ label, icon, error, children }: { label: string; icon: ReactNode; error?: string; children: ReactNode }) {
    return (
        <div className="field">
            <label>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: 13, color: 'var(--text-3)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          {icon}
        </span>
                {children}
            </div>
            {error && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>{error}</span>}
        </div>
    );
}

const inputStyle: CSSProperties = { width: '100%', paddingLeft: 38 };

function SocialButton({ mark, children, onClick }: { mark: string; children: ReactNode; onClick: () => void }) {
    return (
        <button type="button" className="btn btn-ghost btn-block" onClick={onClick} style={{ justifyContent: 'center', gap: 10 }}>
      <span style={{
          width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center',
          background: 'var(--text)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em',
      }}>{mark}</span>
            {children}
        </button>
    );
}

function BrandPanel() {
    const navigate = useNavigate();
    const ticks = [
        'One profile, matched both ways',
        'See your fit score instantly',
        'Talk to real admissions officers',
    ];
    return (
        <div style={{
            background: 'var(--text)', color: 'var(--bg)',
            padding: '48px 44px', display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(620px 320px at 110% -10%, rgba(59,91,219,0.30), transparent 60%), radial-gradient(520px 360px at -20% 120%, rgba(255,255,255,0.06), transparent 60%)',
            }} />
            <div onClick={() => navigate("/")}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, cursor: "pointer" }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 7, background: 'var(--bg)', color: 'var(--text)',
                    display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em',
                }}>U</div>
                <div style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em' }}>UniMatch</div>
            </div>

            <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 56 }}>
                <h1 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0, maxWidth: 380 }}>
                    Where students and universities find each other.
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30 }}>
                    {ticks.map((t) => (
                        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, color: 'rgba(246,244,238,0.78)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(246,244,238,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Check size={11} />
              </span>
                            {t}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(246,244,238,0.14)' }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: 'rgba(246,244,238,0.9)', textWrap: 'pretty' as CSSProperties['textWrap'] }}>
                    “I went from a list of 40 schools to three real conversations in a weekend.”
                </p>
                <div style={{ fontSize: 12, color: 'rgba(246,244,238,0.55)', marginTop: 10 }}>Maya R. · Class of 2026</div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [role, setRole] = useState<Role>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [agree, setAgree] = useState(false);
    const [touched, setTouched] = useState(false);

    const copy = ROLE_COPY[role];
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const score = passwordScore(password);
    const pwValid = password.length >= 8;
    const canSubmit = emailValid && pwValid && agree;

    const segValue = role === 'student' ? "I'm a student" : "I'm a university";
    const onSeg = (value: string) => setRole(value.includes('student') ? 'student' : 'university');

    const submit = async () => {
        setTouched(true);
        if (!canSubmit) return;
        try {
            localStorage.setItem('um.signup', JSON.stringify({ role, email }));
            const url = "http://localhost:3000/auth/registration";
            const res = await fetch(url, {
                method: "POST",
                credentials: "include", // so the session cookie set on register is stored
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: role.toUpperCase(),
                    email,
                    password,
                }),
            });
            if (!res.ok) throw new Error('Failed to register');
            await res.json().catch(() => ({}));

            // Registration establishes the session → load it into context so the
            // (now protected) onboarding route lets the new user through.
            await refreshUser();
            navigate(`/onboarding/${role}`);
        } catch {
            // Surface an error to the user here if you want; navigation is skipped.
        }
    };

    const strengthColor = useMemo(() => ['var(--danger)', 'var(--danger)', 'var(--warning)', 'var(--success)', 'var(--success)'][score], [score]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)' }}
            className="signup-grid"
        >
            <BrandPanel />

            {/* Form side */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 32px' }}>
          <span className="mute text-sm">
            Already have an account?{' '}
              <a onClick={() => navigate("/login")} style={{ color: 'var(--text)', fontWeight: 500, cursor: 'pointer' }}>Sign in</a>
          </span>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 48px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                        style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 22 }}
                    >
                        <div>
                            <h2 className="h2">Create your account</h2>
                            <p className="mute" style={{ marginTop: 6 }}>Free to join. Your first matches take about four minutes.</p>
                        </div>

                        <Segmented options={["I'm a student", "I'm a university"]} value={segValue} onChange={onSeg} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <SocialButton mark="G" onClick={submit}>Continue with Google</SocialButton>
                            <SocialButton mark="@" onClick={submit}>Continue with email link</SocialButton>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-3)' }}>
                            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
                            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            <Field label="Email" icon={<Mail size={15} />} error={touched && !emailValid ? 'Enter a valid email address' : undefined}>
                                <input className="input" style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={copy.emailPlaceholder} />
                            </Field>

                            <Field label="Password" icon={<Lock size={15} />} error={touched && !pwValid ? 'Use at least 8 characters' : undefined}>
                                <input className="input" style={{ ...inputStyle, paddingRight: 42 }} type={showPw ? 'text' : 'password'}
                                       value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
                                <button type="button" onClick={() => setShowPw((s) => !s)}
                                        style={{ position: 'absolute', right: 10, color: 'var(--text-3)', display: 'grid', placeItems: 'center', padding: 4 }}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </Field>

                            {password.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: -4 }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {[0, 1, 2, 3].map((i) => (
                                            <span key={i} style={{
                                                flex: 1, height: 3, borderRadius: 999,
                                                background: i < score ? strengthColor : 'rgba(24,24,27,0.09)',
                                                transition: 'background 0.2s ease',
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Password strength: <span style={{ color: strengthColor, fontWeight: 500 }}>{STRENGTH[score]}</span></span>
                                </div>
                            )}
                        </div>

                        <button type="button" onClick={() => setAgree((a) => !a)}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left' }}>
              <span style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: `1px solid ${agree ? 'var(--text)' : 'var(--border-strong)'}`,
                  background: agree ? 'var(--text)' : 'transparent', color: 'var(--bg)',
                  display: 'grid', placeItems: 'center', transition: 'all 0.15s ease',
              }}>
                {agree && <Check size={12} />}
              </span>
                            <span className="text-sm" style={{ color: 'var(--text-2)', lineHeight: 1.5 }}>
                I agree to UniMatch's <a style={{ color: 'var(--text)', textDecoration: 'underline' }}>Terms</a> and <a style={{ color: 'var(--text)', textDecoration: 'underline' }}>Privacy Policy</a>.
              </span>
                        </button>
                        {touched && !agree && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: -12 }}>Please accept the terms to continue</span>}

                        <Button size="lg" block onClick={submit} iconRight={<ArrowRight size={16} />} disabled={touched && !canSubmit}>
                            Create account
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
