import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
    'Warming up the matchmaker',
    'Scoring your fit signals',
    'Lining up universities',
    'Almost there',
];

interface LoadingScreenProps {
    /** Called once the progress fill reaches 100% and the screen fades out. */
    onDone?: () => void;
    /** Total time to reach 100%, in ms. Default 2200. */
    duration?: number;
}

export default function LoadingScreen({ onDone, duration = 2200 }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const startRef = useRef<number | null>(null);

    useEffect(() => {
        let raf = 0;
        const tick = (t: number) => {
            if (startRef.current === null) startRef.current = t;
            const elapsed = t - startRef.current;
            // ease-out so it slows as it fills
            const p = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - p, 2.2);
            setProgress(Math.round(eased * 100));
            if (p < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setDone(true);
                window.setTimeout(() => onDone?.(), 480);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [duration, onDone]);

    const msgIndex = Math.min(MESSAGES.length - 1, Math.floor((progress / 100) * MESSAGES.length));

    return (
        <div
            className={`um-loader${done ? ' is-done' : ''}`}
            style={{
                background: 'var(--text)', color: 'var(--bg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(680px 380px at 50% 28%, rgba(59,91,219,0.26), transparent 62%), radial-gradient(520px 360px at 50% 120%, rgba(255,255,255,0.05), transparent 60%)',
            }} />

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
                {/* Logo + orbiting ring */}
                <div style={{ position: 'relative', width: 92, height: 92, display: 'grid', placeItems: 'center' }}>
                    <svg width="92" height="92" viewBox="0 0 92 92" style={{ position: 'absolute', inset: 0, animation: 'umSpin 1.1s linear infinite' }}>
                        <circle cx="46" cy="46" r="43" fill="none" stroke="rgba(246,244,238,0.12)" strokeWidth="2" />
                        <circle cx="46" cy="46" r="43" fill="none" stroke="#3b5bdb" strokeWidth="2" strokeLinecap="round" strokeDasharray="64 206" />
                    </svg>
                    <div style={{
                        width: 60, height: 60, borderRadius: 18, background: 'var(--bg)', color: 'var(--text)',
                        display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em',
                        animation: 'umLogoPulse 1.8s ease-in-out infinite',
                    }}>U</div>
                </div>

                {/* Wordmark */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em' }}>Versiti</div>
                    <div style={{ fontSize: 13, color: 'rgba(246,244,238,0.6)', marginTop: 6, minHeight: 18, transition: 'opacity 0.3s ease' }}>
                        {MESSAGES[msgIndex]}
                        <span style={{ display: 'inline-flex', gap: 3, marginLeft: 6, verticalAlign: 'middle' }}>
              {[0, 1, 2].map((i) => (
                  <span key={i} className="um-dot" style={{ animationDelay: `${i * 0.18}s`, background: 'rgba(246,244,238,0.7)' }} />
              ))}
            </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: 220, marginTop: 4 }}>
                    <div style={{ height: 4, borderRadius: 999, background: 'rgba(246,244,238,0.12)', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${progress}%`, borderRadius: 999,
                            background: 'linear-gradient(90deg, #3b5bdb, #6f86e8)', transition: 'width 0.12s linear',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'rgba(246,244,238,0.45)' }}>
                        <span>Loading your matches</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
