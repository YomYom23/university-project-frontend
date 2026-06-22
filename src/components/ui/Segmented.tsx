interface Props { options: string[]; value: string; onChange: (v: string) => void }

export default function Segmented({ options, value, onChange }: Props) {
  return (
    <div className="seg">
      {options.map((option) => (
        <button key={option} className={`seg-opt ${value === option ? 'seg-opt-active' : ''}`} onClick={() => onChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

