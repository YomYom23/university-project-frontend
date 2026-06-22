import type { ReactNode } from 'react';

type Tone = 'default' | 'blue' | 'green' | 'amber' | 'red';

export default function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge ${tone !== 'default' ? `badge-${tone}` : ''}`}>{children}</span>;
}
