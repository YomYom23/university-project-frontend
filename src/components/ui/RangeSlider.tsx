import { useCallback, useEffect, useRef } from 'react';

interface SingleProps {
  label?: string;
  min: number; max: number; step?: number;
  // Optional: an in-progress form legitimately has no value yet.
  value?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export function RangeSlider({ label, min, max, step = 1, value = min, onChange, format }: SingleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = ((value - min) / (max - min)) * 100;

  const updateFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    const t = trackRef.current; if (!t) return;
    const r = t.getBoundingClientRect();
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const p = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    let raw = min + p * (max - min);
    raw = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, raw)));
  }, [min, max, step, onChange]);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => { if (dragging.current) updateFromEvent(e); };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [updateFromEvent]);

  return (
    <div className="slider-wrap">
      <div className="slider-row">
        {label && <label style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</label>}
        <span className="slider-value">{format ? format(value) : value}</span>
      </div>
      <div ref={trackRef} className="slider-track"
        onMouseDown={(e) => { dragging.current = true; updateFromEvent(e.nativeEvent); }}
        onTouchStart={(e) => { dragging.current = true; updateFromEvent(e.nativeEvent); }}>
        <div className="slider-fill" style={{ left: 0, width: `${pct}%` }} />
        <div className="slider-handle" style={{ left: `${pct}%` }} />
      </div>
    </div>
  );
}

interface DualProps {
  label?: string;
  min: number; max: number; step?: number;
  value?: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (v: number) => string;
}

export function DualRangeSlider({ label, min, max, step = 1, value, onChange, format }: DualProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragHandle = useRef<'lo' | 'hi' | null>(null);
  const [lo, hi] = value ?? [min, max];
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;

  const updateFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    const t = trackRef.current; if (!t || !dragHandle.current) return;
    const r = t.getBoundingClientRect();
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const p = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    let raw = min + p * (max - min);
    raw = Math.round(raw / step) * step;
    if (dragHandle.current === 'lo') onChange([Math.min(raw, hi - step), hi]);
    else onChange([lo, Math.max(raw, lo + step)]);
  }, [min, max, step, onChange, lo, hi]);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => { if (dragHandle.current) updateFromEvent(e); };
    const up = () => { dragHandle.current = null; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [updateFromEvent]);

  return (
    <div className="slider-wrap">
      <div className="slider-row">
        {label && <label style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</label>}
        <span className="slider-value">{format ? `${format(lo)} – ${format(hi)}` : `${lo} – ${hi}`}</span>
      </div>
      <div ref={trackRef} className="slider-track">
        <div className="slider-fill" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
        <div className="slider-handle" style={{ left: `${loPct}%` }}
          onMouseDown={(e) => { e.stopPropagation(); dragHandle.current = 'lo'; }}
          onTouchStart={(e) => { e.stopPropagation(); dragHandle.current = 'lo'; }} />
        <div className="slider-handle" style={{ left: `${hiPct}%` }}
          onMouseDown={(e) => { e.stopPropagation(); dragHandle.current = 'hi'; }}
          onTouchStart={(e) => { e.stopPropagation(); dragHandle.current = 'hi'; }} />
      </div>
    </div>
  );
}
