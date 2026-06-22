interface InputProps {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

export function Input({ label, value, onChange, type = 'text', placeholder }: InputProps) {
  const isEmpty = value === '' || value === undefined || value === null;
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input
        className={`input${isEmpty ? ' input-empty' : ''}`}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function Textarea({ label, value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <textarea
        className="textarea"
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
