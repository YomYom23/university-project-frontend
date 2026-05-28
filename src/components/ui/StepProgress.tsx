import { Fragment } from 'react';
import { Check } from 'lucide-react';

interface Props { steps: string[]; current: number }

export default function StepProgress({ steps, current }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="step-row">
        {steps.map((_s, i) => (
          <Fragment key={i}>
            <div className={`step-dot ${i === current ? 'step-dot-active' : ''} ${i < current ? 'step-dot-done' : ''}`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="step-bar">
                <div className="step-bar-fill" style={{ width: i < current ? '100%' : '0%' }} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="step-row" style={{ marginTop: 4 }}>
        {steps.map((s, i) => (
          <Fragment key={i}>
            <div style={{ width: 32 }} className="step-label">{s}</div>
            {i < steps.length - 1 && <div style={{ flex: 1 }} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
