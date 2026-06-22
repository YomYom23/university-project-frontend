import type { ReactNode } from 'react';
import { Search, type LucideIcon } from 'lucide-react';
import Avatar from '../ui/Avatar';
import type { NavItem } from '../../types';

interface Props {
  name: string;
  subtitle: string;
  gradient?: string;
  iconMap: Record<string, LucideIcon>;
  nav: NavItem[];
  current: string;
  onNav: (k: string) => void;
  onBack?: () => void;
  badge?: ReactNode;
  title?: string;
  hint?: string;
}

export default function TopNav({
                                 name, subtitle, gradient, iconMap, nav, current, onNav, onBack, badge, title, hint,
                               }: Props) {
  return (
      <header className="topbar">
        <div className="topbar-row">
          <button className="topbar-brand" onClick={onBack}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: 'var(--text)', color: 'var(--bg)',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 12, letterSpacing: '-0.02em',
            }}>U</div>
            <div style={{ fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em' }}>UniMatch</div>
          </button>

          <div className="topbar-actions">
            {badge}
            <button className="icon-btn" aria-label="Search"><Search size={15} /></button>
            <div className="topbar-user">
              <Avatar name={name} size={30} gradient={gradient} />
              <div>
                <div className="topbar-user-name">{name}</div>
                <div className="topbar-user-sub">{subtitle}</div>
              </div>
            </div>
          </div>
        </div>

        {(title || hint) && (
            <div className="topbar-title">
              {title && <h1>{title}</h1>}
              {hint && <p>{hint}</p>}
            </div>
        )}

        <nav className="topnav">
          {nav.map((item) => {
            const Ico = iconMap[item.icon];
            return (
                <button key={item.key}
                        className={`nav-item ${current === item.key ? 'nav-item-active' : ''}`}
                        onClick={() => onNav(item.key)}>
                  {Ico && <Ico size={14} />}
                  <span>{item.label}</span>
                  {item.badge ? <span className="topnav-badge">{item.badge}</span> : null}
                </button>
            );
          })}
        </nav>
      </header>
  );
}
