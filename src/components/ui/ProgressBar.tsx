import { motion } from 'framer-motion';

interface Props {
  value: number;
  max?: number;
  color?: string;
  label?: string;
}

export default function ProgressBar({ value, max = 100, color, label }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <div className="text-sm mute">{label}</div>}
      <div className="pbar">
        <motion.div
          className="pbar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}
