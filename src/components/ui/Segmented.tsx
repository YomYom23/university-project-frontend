interface Props { options: string[]; value: string; onChange: (v: string) => void }

export default function Segmented({ options, value, onChange }: Props) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o} className={`seg-opt ${value === o ? 'seg-opt-active' : ''}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}
