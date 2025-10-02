import React, { useMemo, useState } from 'react';
import { generateTimeSlots, isOverlap } from '../utils/time';

// PUBLIC_INTERFACE
export default function Calendar({
  rooms,
  surgeries,
  onDropSurgery,
  onOpenSurgery,
  start = '07:00',
  end = '19:00',
  stepMin = 60,
}) {
  /** Grid calendar with rooms as columns and time as rows; supports DnD. */
  const times = useMemo(() => generateTimeSlots(start, end, stepMin), [start, end, stepMin]);
  const [dragOver, setDragOver] = useState({}); // { `${roomId}-${time}`: true }

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const onDragEnter = (roomId, time) => setDragOver((s) => ({ ...s, [`${roomId}-${time}`]: true }));
  const onDragLeave = (roomId, time) => setDragOver((s) => {
    const n = { ...s }; delete n[`${roomId}-${time}`]; return n;
  });

  const handleDrop = (ev, roomId, time) => {
    ev.preventDefault();
    const dataRaw = ev.dataTransfer.getData('text/plain');
    try {
      const data = JSON.parse(dataRaw);
      onDropSurgery?.({ ...data, roomId, startTime: time });
    } catch {
      // ignore bad payload
    }
    onDragLeave(roomId, time);
  };

  const roomCount = rooms?.length || 0;

  return (
    <div className="panel">
      <div className="calendar">
        <div className="calendar-header" style={{ ['--room-count']: roomCount }}>
          <div className="col">Time</div>
          {rooms.map((r) => (
            <div className="col" key={r.id}>{r.name}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8 }}>
          <div className="time-col">
            {times.map((t) => (
              <div key={t} className="time-cell">{t}</div>
            ))}
          </div>
          <div className="room-cols" style={{ ['--room-count']: roomCount }}>
            {rooms.map((room) => (
              <div className="room-col" key={room.id}>
                {times.map((t) => {
                  const key = `${room.id}-${t}`;
                  return (
                    <div
                      key={t}
                      className={`slot droppable ${dragOver[key] ? 'drag-over' : ''}`}
                      onDragOver={allowDrop}
                      onDragEnter={() => onDragEnter(room.id, t)}
                      onDragLeave={() => onDragLeave(room.id, t)}
                      onDrop={(e) => handleDrop(e, room.id, t)}
                      aria-label={`Drop zone ${room.name} at ${t}`}
                    >
                      {surgeries.filter((s) => s.roomId === room.id && isOverlap(s.startTime, s.endTime, t, addStep(t, stepMin)))
                        .map((s) => (
                          <SurgeryCard key={s.id} surgery={s} onOpen={() => onOpenSurgery(s)} />
                        ))
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function addStep(t, stepMin) {
  const [h, m] = t.split(':').map(Number);
  const dt = new Date();
  dt.setHours(h, m + stepMin, 0, 0);
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function SurgeryCard({ surgery, onOpen }) {
  const typeClass = surgery.type === 'emergency' ? 'surgery-emergency' : 'surgery-elective';

  const onDragStart = (ev) => {
    ev.dataTransfer.setData('text/plain', JSON.stringify({ id: surgery.id }));
    ev.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`surgery-card ${typeClass}`}
      draggable
      onDragStart={onDragStart}
      onDoubleClick={onOpen}
      role="button"
      aria-label={`${surgery.type} surgery ${surgery.title}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(); }}
    >
      <div className="surgery-title">{surgery.title}</div>
      <div className="surgery-meta">
        {surgery.startTime}–{surgery.endTime} • {surgery.roomName || surgery.roomId}
      </div>
      {surgery.doctor && (
        <div className="surgery-meta">👨‍⚕️ {surgery.doctor.name}</div>
      )}
      {!!(surgery.nurses?.length) && (
        <div className="surgery-meta">🧑‍⚕️ {surgery.nurses.map((n) => n.name).join(', ')}</div>
      )}
    </div>
  );
}
