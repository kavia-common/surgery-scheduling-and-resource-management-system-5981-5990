import React from 'react';

// PUBLIC_INTERFACE
export default function ResourcesPanel({ resources }) {
  /** Displays doctors and nurses. */
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Resources</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <h4>Doctors</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {resources.doctors.map((d) => (
              <div key={d.id} className="device-pill" title={d.specialty}>
                <span aria-hidden>👨‍⚕️</span>
                <span>{d.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6B7280' }}>{d.specialty}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4>Nurses</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {resources.nurses.map((n) => (
              <div key={n.id} className="device-pill">
                <span aria-hidden>🧑‍⚕️</span>
                <span>{n.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6B7280' }}>ID: {n.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
