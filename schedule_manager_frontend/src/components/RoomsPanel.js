import React from 'react';

// PUBLIC_INTERFACE
export default function RoomsPanel({ rooms }) {
  /** Displays list of rooms and basic info. */
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>Operating Rooms</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {rooms.map((r) => (
          <div key={r.id} className="device-pill" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden>🏥</span>
              <strong>{r.name}</strong>
            </div>
            <span style={{ fontSize: 12, color: '#6B7280' }}>ID: {r.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
