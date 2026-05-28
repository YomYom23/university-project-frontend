import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Tab { key: string; label: string }

interface Props {
  tabs: Tab[];
  value: string;
  onChange: (k: string) => void;
}

export default function Tabs({ tabs, value, onChange }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ind, setInd] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const i = tabs.findIndex((t) => t.key === value);
    const el = refs.current[i];
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, tabs]);

  return (
    <div className="tabs">
      {tabs.map((t, i) => (
        <button
          key={t.key}
          ref={(el) => { refs.current[i] = el; }}
          className={`tab ${value === t.key ? 'tab-active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
      <motion.div className="tab-underline" animate={{ left: ind.left, width: ind.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
    </div>
  );
}
