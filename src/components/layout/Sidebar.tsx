import type { ReactNode } from 'react';
import { Sparkles, ChevronLeft, type LucideIcon } from 'lucide-react';
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
  footer?: ReactNode;
}

export default function Sidebar({ name, subtitle, gradient, iconMap, nav, current, onNav, onBack, footer }: Props) {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'var(--cta-grad)', display: 'grid', placeItems: 'center',
          }}>
            <Sparkles size={14} />
          </div>
          <div style={{ fontWeight: 700 }}>UniMatch</div>
        </div>
        <div className="sidebar-user">
          <Avatar name={name} size={42} gradient={gradient} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </div>
            <div className="mute text-xs" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {subtitle}
            </div>
          </div>
        </div>
        <div className="sidebar-nav">
          {nav.map((item) => {
            const Ico = iconMap[item.icon];
            return (
              <button key={item.key}
                className={`nav-item ${current === item.key ? 'nav-item-active' : ''}`}
                onClick={() => onNav(item.key)}>
                {Ico && <Ico size={16} />}
                <span>{item.label}</span>
                {item.badge ? (
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, padding: '2px 7px', borderRadius: 8,
                    background: 'rgba(59,130,246,0.2)', color: '#bfdbfe',
                  }}>{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        {footer ?? (onBack && (
          <button className="nav-item" onClick={onBack}>
            <ChevronLeft size={16} /> Back to landing
          </button>
        ))}
      </aside>

      <nav className="mobile-nav">
        {nav.slice(0, 5).map((item) => {
          const Ico = iconMap[item.icon];
          return (
            <button key={item.key}
              className={`nav-item ${current === item.key ? 'nav-item-active' : ''}`}
              onClick={() => onNav(item.key)}>
              {Ico && <Ico size={18} />}
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
