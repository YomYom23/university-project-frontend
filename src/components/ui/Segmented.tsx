// `value` is optional: an in-progress form legitimately has no selection yet,
// in which case no segment renders as active.
interface Props { options: string[]; value?: string; onChange: (v: string) => void }

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

