import React from 'react';

// PUBLIC_INTERFACE
export default function Topbar({
  dateISO,
  onPrevDay,
  onNextDay,
  onToday,
  onNewSurgery,
  deviceStatus,
}) {
  /** Top navigation bar: date controls, actions, device status. */
  const d = new Date(dateISO);
  const display = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="topbar" role="banner">
      <div className="top-left">
        <button className="btn" onClick={onPrevDay} aria-label="Previous day">◀</button>
        <div className="top-title" aria-live="polite">{display}</div>
        <button className="btn" onClick={onNextDay} aria-label="Next day">▶</button>
        <button className="btn" onClick={onToday} aria-label="Go to today">Today</button>
      </div>
      <div className="top-actions">
        <span className="badge" aria-label="Notifications">🔔 Notifications</span>
        <button className="btn btn-amber" onClick={onNewSurgery}>+ New Surgery</button>
        <div aria-label="Device connection status" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {deviceStatus?.devices?.map((dv) => (
            <div className="device-pill" key={dv.id} title={`${dv.name}: ${dv.status}`}>
              <span className={`dot ${dv.status}`} aria-hidden />
              <span style={{ fontSize: 12 }}>{dv.name}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
