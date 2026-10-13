import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Target, User, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function Logo({ size = 22 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.25),
      background: 'var(--text)', color: 'var(--bg)',
      display: 'grid', placeItems: 'center',
      fontSize: Math.round(size * 0.5), fontWeight: 700, letterSpacing: '-0.02em',
    }}>U</div>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <h1 className="h1" style={{ textAlign: 'center' }}>
      {words.map((w, i) => (
        <motion.span key={i}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}

function RoleCard({ tag, title, subtitle, bullets, onClick }: {
  tag: string; title: string; subtitle: string; bullets: string[]; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="glass"
      whileHover={{ y: -3 }}
      style={{
        padding: 28, display: 'flex', flexDirection: 'column', gap: 16,
        textAlign: 'left', cursor: 'pointer', position: 'relative',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tag}</div>
      <div>
        <div className="h3" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em' }}>{title}</div>
        <div className="mute text-sm" style={{ marginTop: 6, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
            <span style={{ width: 14, height: 1, background: 'var(--text-3)' }} />{b}
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: 'var(--text)', fontWeight: 500, marginTop: 'auto', fontSize: 13,
      }}>
        Get started <ArrowRight size={14} />
      </div>
    </motion.button>
  );
}

function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const numericTarget = parseInt(value.replace(/[^0-9]/g, ''), 10);
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1200;
    const tick = (t: number) => {
      if (t < start) { raf = requestAnimationFrame(tick); return; }
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(numericTarget * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay]);
  const formatted = value.replace(/[0-9,]+/, n.toLocaleString());
  return (
    <div style={{ padding: '18px 28px', textAlign: 'center', minWidth: 160 }}>
      <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{formatted}</div>
      <div className="mute text-xs" style={{ marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function FeatureCard({ Icon, title, body }: { Icon: typeof Target; title: string; body: string }) {
  return (
    <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(24,24,27,0.04)', border: '1px solid var(--border)',
        display: 'grid', placeItems: 'center', color: 'var(--text-2)',
      }}>
        <Icon size={18} />
      </div>
      <div className="h3">{title}</div>
      <div className="mute text-sm" style={{ lineHeight: 1.6 }}>{body}</div>
    </Card>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* Top nav */}
      <nav style={{
        position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '22px 32px', maxWidth: 1160, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Logo size={22} />
          <div style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em' }}>Versiti</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="#features" className="mute text-sm" style={{ marginRight: 8 }}>Features</a>
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
          <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px 30px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Badge>2026 admissions season</Badge>
        </div>
        <AnimatedHeadline text="Find your perfect match." />
        <motion.p className="mute"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: 'center', fontSize: 17, marginTop: 22, maxWidth: 540, margin: '22px auto 0', lineHeight: 1.55 }}>
          Students discover universities. Universities discover students.
          One profile, mutual matches, real conversations.
        </motion.p>

        <motion.div className="hero-cta-grid"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <RoleCard tag="For students" title="I'm a student"
            subtitle="Build your profile, get matched with universities that actually fit."
            bullets={['Personalized match scores', 'Compare schools side by side', 'Hear from admissions officers']}
            onClick={() => navigate('/onboarding/student')} />
          <RoleCard tag="For universities" title="I'm a university"
            subtitle="Find the students who are the strongest fit for your programs."
            bullets={['Searchable candidate pool', 'Match-quality analytics', 'Outreach in one click']}
            onClick={() => navigate('/onboarding/university')} />
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0,
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }}>
          <StatPill value="12,000+" label="Students profiled" delay={300} />
          <StatPill value="800+" label="Universities matched" delay={500} />
          <StatPill value="94%" label="Match satisfaction" delay={700} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <div style={{ textAlign: 'left', marginBottom: 40, maxWidth: 600 }}>
          <h2 className="h2">A better way to choose, both ways.</h2>
          <p className="mute" style={{ marginTop: 10 }}>Designed from the ground up for mutual discovery.</p>
        </div>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <FeatureCard Icon={Target} title="Smart matching"
            body="A multi-signal model weighs academics, budget, vibe, location, and goals — not just rankings." />
          <FeatureCard Icon={User} title="Real profiles"
            body="Students share more than test scores. Universities share more than brochure copy. Real signal, both sides." />
          <FeatureCard Icon={Zap} title="Instant results"
            body="See your top matches the moment your profile is complete. No waiting list, no gatekeepers." />
        </div>
      </section>

      {/* CTA strip */}
      <section className="section" style={{ paddingBottom: 80, paddingTop: 40 }}>
        <div style={{ textAlign: 'center', padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
          <h2 className="h2">Ready to be matched?</h2>
          <p className="mute" style={{ marginTop: 10, marginBottom: 28 }}>It takes about four minutes.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/onboarding/student')} iconRight={<ArrowRight size={16} />}>Start as a student</Button>
            <Button variant="ghost" onClick={() => navigate('/onboarding/university')} iconRight={<ArrowRight size={16} />}>Start as a university</Button>
          </div>
        </div>
      </section>

      <footer style={{
        position: 'relative', zIndex: 1, padding: '28px 24px 36px',
        borderTop: '1px solid var(--border)', maxWidth: 1160, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo size={18} />
            <div style={{ fontWeight: 500, fontSize: 14 }}>Versiti</div>
            <span className="mute text-xs" style={{ marginLeft: 10 }}>© 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 22 }} className="mute text-xs">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a><a href="#">Press</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
