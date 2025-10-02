import React from 'react';

// PUBLIC_INTERFACE
export default function DevicesPanel({ deviceStatus, onRefresh }) {
  /** Summary panel for mocked device connection status. */
  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ marginTop: 0 }}>Devices</h3>
        <button className="btn" onClick={onRefresh}>Refresh</button>
      </div>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
        Last updated: {deviceStatus?.lastUpdated ? new Date(deviceStatus.lastUpdated).toLocaleTimeString() : '—'}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {deviceStatus?.devices?.map((dv) => (
          <div key={dv.id} className="device-pill" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`dot ${dv.status}`} aria-hidden />
              <strong>{dv.name}</strong>
            </div>
            <span style={{ fontSize: 12, color: '#6B7280' }}>{dv.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
