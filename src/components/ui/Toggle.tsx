import { motion } from 'framer-motion';

interface Props { value: boolean; onChange: (v: boolean) => void }

export default function Toggle({ value, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 999, position: 'relative',
        background: value ? 'var(--cta-grad)' : 'rgba(255,255,255,0.1)',
        transition: 'background 0.2s ease',
      }}
    >
      <motion.span
        animate={{ left: value ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
          background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}
