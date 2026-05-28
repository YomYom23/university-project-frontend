import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Sparkles, ArrowRight, Check, Target, User, Zap,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function FloatingOrbs() {
  return (
    <div className="orb-field" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
    </div>
  );
}

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <h1 className="h1" style={{ textAlign: 'center', perspective: 600 }}>
      {words.map((w, i) => (
        <motion.span key={i}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
          initial={{ opacity: 0, y: 20, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: i * 0.12, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {i >= words.length - 2 ? <span className="gradient-text">{w}</span> : w}
        </motion.span>
      ))}
    </h1>
  );
}

function RoleCard({ icon, title, subtitle, bullets, onClick, gradient }: {
  icon: string; title: string; subtitle: string; bullets: string[]; onClick: () => void; gradient: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="glass"
      whileHover={{ y: -6 }}
      style={{
        padding: 36, display: 'flex', flexDirection: 'column', gap: 18,
        textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
        background: gradient, filter: 'blur(60px)', opacity: 0.4,
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: gradient,
          display: 'grid', placeItems: 'center', fontSize: 28,
          boxShadow: '0 14px 30px -10px rgba(59,130,246,0.5)',
        }}>{icon}</div>
        <div>
          <div className="h3">{title}</div>
          <div className="mute text-sm" style={{ marginTop: 4 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
              <Check size={14} />{b}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, marginTop: 'auto' }}>
          Get started <ArrowRight size={16} />
        </div>
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
    <Card style={{ padding: '22px 28px', textAlign: 'center', minWidth: 180 }}>
      <div className="h2 gradient-text" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatted}</div>
      <div className="mute text-sm" style={{ marginTop: 6 }}>{label}</div>
    </Card>
  );
}

function FeatureCard({ Icon, title, body }: { Icon: typeof Target; title: string; body: string }) {
  return (
    <Card style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
        display: 'grid', placeItems: 'center', color: '#93c5fd',
      }}>
        <Icon size={22} />
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
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      <FloatingOrbs />

      <nav style={{
        position: 'relative', zIndex: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '22px 32px', maxWidth: 1240, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--cta-grad)', display: 'grid', placeItems: 'center',
          }}><Sparkles size={18} /></div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>UniMatch</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/onboarding/student')}>Sign in</Button>
      </nav>

      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Badge tone="blue"><Sparkles size={12} /> Built for the 2026 admissions season</Badge>
        </div>
        <AnimatedHeadline text="Find Your Perfect Match" />
        <motion.p className="mute"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
          style={{ textAlign: 'center', fontSize: 18, marginTop: 20, maxWidth: 620, margin: '20px auto 0' }}>
          Students discover universities. Universities discover students.<br />
          One profile. Mutual matches. Real conversations.
        </motion.p>

        <motion.div className="hero-cta-grid"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <RoleCard icon="🎓" title="I'm a Student"
            subtitle="Build your profile, get matched with universities that actually fit."
            bullets={['Personalized match scores', 'Compare 10+ schools side by side', 'Hear from admissions officers']}
            gradient="linear-gradient(135deg, #2563eb, #3b82f6)"
            onClick={() => navigate('/onboarding/student')} />
          <RoleCard icon="🏛️" title="I'm a University"
            subtitle="Find the students who are the strongest fit for your programs."
            bullets={['Searchable candidate pool', 'Match-quality analytics', 'Outreach in one click']}
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            onClick={() => navigate('/onboarding/university')} />
        </motion.div>
      </section>

      <section style={{
        position: 'relative', zIndex: 1, padding: '24px 24px 60px',
        maxWidth: 900, margin: '0 auto',
        display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap',
      }}>
        <StatPill value="12,000+" label="Students profiled" delay={300} />
        <StatPill value="800+" label="Universities matched" delay={500} />
        <StatPill value="94%" label="Match satisfaction rate" delay={700} />
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="h2">A better way to choose, both ways.</h2>
          <p className="mute" style={{ marginTop: 12 }}>Designed from the ground up for mutual discovery.</p>
        </div>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <FeatureCard Icon={Target} title="Smart Matching"
            body="A multi-signal model weighs academics, budget, vibe, location, and goals — not just rankings." />
          <FeatureCard Icon={User} title="Real Profiles"
            body="Students share more than test scores. Universities share more than brochure copy. Real signal, both sides." />
          <FeatureCard Icon={Zap} title="Instant Results"
            body="See your top matches the moment your profile is complete. No waiting list, no gatekeepers." />
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 60, paddingTop: 20 }}>
        <Card style={{ padding: '48px 40px', textAlign: 'center', background: 'var(--primary-grad)' }}>
          <h2 className="h2">Ready to be matched?</h2>
          <p className="mute" style={{ marginTop: 10, marginBottom: 28 }}>It takes about 4 minutes. We promise.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button size="lg" onClick={() => navigate('/onboarding/student')} iconRight={<ArrowRight size={16} />}>Start as a student</Button>
            <Button size="lg" variant="ghost" onClick={() => navigate('/onboarding/university')} iconRight={<ArrowRight size={16} />}>Start as a university</Button>
          </div>
        </Card>
      </section>

      <footer style={{
        position: 'relative', zIndex: 1, padding: '32px 24px 40px',
        borderTop: '1px solid var(--border)', maxWidth: 1240, margin: '40px auto 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--cta-grad)', display: 'grid', placeItems: 'center',
            }}><Sparkles size={14} /></div>
            <div style={{ fontWeight: 700 }}>UniMatch</div>
            <span className="mute text-sm" style={{ marginLeft: 12 }}>© 2026 — University Project Edition</span>
          </div>
          <div style={{ display: 'flex', gap: 22 }} className="mute text-sm">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a><a href="#">Press</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
