import { Check } from 'lucide-react';

interface Props {
  options: string[];
  // Optional: an in-progress form legitimately has nothing selected yet.
  value?: string[];
  onChange: (v: string[]) => void;
  single?: boolean;
}

export default function MultiChipSelect({ options, value = [], onChange, single }: Props) {
  const toggle = (opt: string) => {
    if (single) onChange([opt]);
    else if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const sel = value.includes(o);
        return (
          <button key={o} className={`chip ${sel ? 'chip-selected' : ''}`} onClick={() => toggle(o)}>
            {sel && <Check size={12} />}
            {o}
          </button>
        );
      })}
    </div>
  );
}
