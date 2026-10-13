import { useState, type ReactNode, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

function Field({ label, icon, error, action, children }: { label: string; icon: ReactNode; error?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <div className="field">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label>{label}</label>
                {action}
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: 13, color: 'var(--text-3)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>{icon}</span>
                {children}
            </div>
            {error && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>{error}</span>}
        </div>
    );
}

const inputStyle: CSSProperties = { width: '100%', paddingLeft: 38 };

function BrandPanel() {
    const navigate = useNavigate();
    return (
        <div style={{
            background: 'var(--text)', color: 'var(--bg)', padding: '48px 44px',
            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
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
                }}>V</div>
                <div style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em' }}>Versiti</div>
            </div>

            <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 56 }}>
                <h1 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0, maxWidth: 380 }}>
                    Welcome back. Your matches missed you.
                </h1>
                <p style={{ fontSize: 15, lineHeight: 1.6, margin: '18px 0 0', color: 'rgba(246,244,238,0.7)', maxWidth: 360 }}>
                    Pick up where you left off — new conversations, fresh fits, and replies waiting in your inbox.
                </p>
            </div>

            <div style={{ position: 'relative', marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(246,244,238,0.14)', display: 'flex', gap: 36 }}>
                {[['12k+', 'students matched'], ['340', 'partner universities'], ['4 min', 'to first match']].map(([n, l]) => (
                    <div key={l}>
                        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{n}</div>
                        <div style={{ fontSize: 12, color: 'rgba(246,244,238,0.55)', marginTop: 2 }}>{l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SigninPage() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(true);
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState('');

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const pwValid = password.length >= 1;
    const canSubmit = emailValid && pwValid;
    const submit = async () => {
        setError('');
        setTouched(true);
        if (!canSubmit) return;

        try {
            const authUrl = "http://localhost:3000/auth";
            const res = await fetch(`${authUrl}/login`, {
                method: "POST",
                credentials: "include", // send/receive the session cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || "Invalid email or password");
                return;
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            if (data.token) localStorage.setItem('um.token', data.token);
            if (remember) localStorage.setItem('um.login', JSON.stringify({ email }));

            // Pull the freshly-established session into the auth context so
            // ProtectedRoute sees a user instead of bouncing back to /login.

            await refreshUser();
            if(user?.onboardingStep === null){
            // Navigate from the RESPONSE role (not stale state) and normalise
            // casing so it matches the lowercase route paths.
                const nextRole = String(user?.role ?? '').toLowerCase();
                navigate(nextRole === 'university' ? '/university/dashboard' : '/student/dashboard');

            } else {
                navigate(`/onboarding/${String(user?.role).toLowerCase()}`);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)' }}
            className="signup-grid"
        >
            <BrandPanel />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 32px' }}>
          <span className="mute text-sm">
            New to Versiti?{' '}
              <a onClick={() => navigate('/signup')} style={{ color: 'var(--text)', fontWeight: 500, cursor: 'pointer' }}>Create an account</a>
          </span>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 48px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                        style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 22 }}
                    >
                        <div>
                            <h2 className="h2">Sign in</h2>
                            <p className="mute" style={{ marginTop: 6 }}>Welcome back — let's get you to your matches.</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-3)' }}>
                            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
                            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <Field label="Email" icon={<Mail size={15} />} error={touched && !emailValid ? 'Enter a valid email address' : undefined}>
                                <input className="input" style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
                            </Field>

                            <Field
                                label="Password"
                                icon={<Lock size={15} />}
                                error={touched && !pwValid ? 'Enter your password' : undefined}
                                action={<a style={{ fontSize: 12, color: 'var(--text-2)', cursor: 'pointer' }}>Forgot?</a>}
                            >
                                <input className="input" style={{ ...inputStyle, paddingRight: 42 }} type={showPw ? 'text' : 'password'}
                                       value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
                                <button type="button" onClick={() => setShowPw((s) => !s)}
                                        style={{ position: 'absolute', right: 10, color: 'var(--text-3)', display: 'grid', placeItems: 'center', padding: 4 }}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </Field>
                        </div>

                        <button type="button" onClick={() => setRemember((r) => !r)}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                          <span style={{
                              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                              border: `1px solid ${remember ? 'var(--text)' : 'var(--border-strong)'}`,
                              background: remember ? 'var(--text)' : 'transparent', color: 'var(--bg)',
                              display: 'grid', placeItems: 'center', transition: 'all 0.15s ease',
                          }}>
                            {remember && <Check size={12} />}
                          </span>
                            <span className="text-sm" style={{ color: 'var(--text-2)' }}>Keep me signed in</span>
                        </button>

                        <div>
                            {error && (
                                <span style={{
                                    fontSize: 12, color: 'var(--danger)', display: 'grid', placeItems: 'center'
                                }}>{error}
                            </span>
                            )}
                        </div>

                        <Button size="lg" block onClick={submit} iconRight={<ArrowRight size={16} />} disabled={touched && !canSubmit}>
                            Sign in
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
