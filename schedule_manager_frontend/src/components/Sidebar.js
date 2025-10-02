import React from 'react';
import { COLORS } from '../theme';

// PUBLIC_INTERFACE
export default function Sidebar({ active, onNavigate }) {
  /** Sidebar navigation component with Ocean Professional visuals. */
  const items = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'rooms', label: 'Rooms', icon: '🏥' },
    { id: 'resources', label: 'Resources', icon: '👩‍⚕️' },
    { id: 'devices', label: 'Device Status', icon: '🔌' },
  ];
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="brand" aria-label="Brand">
        <div className="mark" title="Ocean Professional" aria-hidden style={{ background: `linear-gradient(135deg, ${COLORS.primary}, rgba(37,99,235,0.65))` }}>
          OP
        </div>
        <div className="title">Surgery Scheduler</div>
      </div>
      <nav className="nav">
        {items.map((it) => (
          <button
            key={it.id}
            className={`nav-btn ${active === it.id ? 'active' : ''}`}
            onClick={() => onNavigate(it.id)}
            aria-current={active === it.id ? 'page' : undefined}
          >
            <span aria-hidden style={{ fontSize: 18 }}>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', fontSize: 12, color: '#6B7280' }}>
        <div>Ocean Professional</div>
        <div>Blue & Amber Accents</div>
      </div>
    </aside>
  );
}
