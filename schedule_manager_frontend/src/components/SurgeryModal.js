import React, { useMemo, useState } from 'react';
import { newId } from '../utils/time';

// PUBLIC_INTERFACE
export default function SurgeryModal({
  isOpen,
  onClose,
  rooms,
  resources,
  initial,
  onSave,
  onDelete,
}) {
  /** Modal for creating/editing a surgery. */
  const defaults = useMemo(() => ({
    id: newId('surg'),
    title: '',
    type: 'elective', // or emergency
    roomId: rooms?.[0]?.id || '',
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
    doctorId: resources?.doctors?.[0]?.id || '',
    nurseIds: [],
  }), [rooms, resources]);

  const [form, setForm] = useState(initial || defaults);

  React.useEffect(() => {
    setForm(initial || defaults);
  }, [initial, defaults]);

  if (!isOpen) return null;

  const doctor = resources.doctors.find((d) => d.id === form.doctorId);
  const nurses = resources.nurses.filter((n) => form.nurseIds.includes(n.id));

  const save = () => {
    if (!form.title || !form.roomId || !form.startTime || !form.endTime) return;
    onSave?.({
      ...form,
      doctor,
      nurses,
      roomName: rooms.find((r) => r.id === form.roomId)?.name || form.roomId,
    });
  };

  const handleNurseToggle = (id) => {
    setForm((f) => ({
      ...f,
      nurseIds: f.nurseIds.includes(id) ? f.nurseIds.filter((x) => x !== id) : [...f.nurseIds, id],
    }));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Surgery Modal">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>{initial ? 'Edit Surgery' : 'New Surgery'}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {initial && <button className="btn" onClick={() => onDelete?.(form.id)} aria-label="Delete surgery">🗑 Delete</button>}
            <button className="btn" onClick={onClose} aria-label="Close">✖</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="field">
              <label htmlFor="s-title">Title</label>
              <input id="s-title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Knee Arthroscopy" />
            </div>
            <div className="field">
              <label htmlFor="s-type">Type</label>
              <select id="s-type" className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="elective">Elective</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="s-room">Room</label>
              <select id="s-room" className="select" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
                {rooms.map((r) => (
                  <option value={r.id} key={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="s-doctor">Doctor</label>
              <select id="s-doctor" className="select" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                {resources.doctors.map((d) => (
                  <option value={d.id} key={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="s-start">Start Time</label>
              <input id="s-start" className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-end">End Time</label>
              <input id="s-end" className="input" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Nurses</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {resources.nurses.map((n) => {
                const checked = form.nurseIds.includes(n.id);
                return (
                  <button
                    type="button"
                    key={n.id}
                    className="btn"
                    onClick={() => handleNurseToggle(n.id)}
                    aria-pressed={checked}
                    style={{
                      background: checked ? '#F59E0B' : undefined,
                      color: checked ? '#111827' : undefined,
                      borderColor: checked ? 'rgba(245,158,11,0.5)' : undefined,
                    }}
                  >
                    {checked ? '✅' : '➕'} {n.name}
                  </button>
                );
              })}
            </div>
            <div className="helper">Toggle to allocate/remove nurses.</div>
          </div>

          <div className="field">
            <label htmlFor="s-notes">Notes</label>
            <textarea id="s-notes" className="textarea" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes, procedure details, equipment needs..." />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-amber" onClick={save}>{initial ? 'Save Changes' : 'Create Surgery'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
