import { motion } from 'framer-motion';

interface Props { value: number; size?: number; stroke?: number }

export default function CircularScore({ value, size = 72, stroke = 6 }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;
  const color = clamped >= 80 ? '#22c55e' : clamped >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="cscore" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} className="cscore-track" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          className="cscore-fill" stroke={color} strokeWidth={stroke}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div className="cscore-label" style={{ fontSize: size * 0.28, color }}>
        {clamped}<span style={{ fontSize: size * 0.16, opacity: 0.7 }}>%</span>
      </div>
    </div>
  );
}
