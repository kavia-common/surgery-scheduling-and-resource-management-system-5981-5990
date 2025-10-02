import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Calendar from './components/Calendar';
import SurgeryModal from './components/SurgeryModal';
import RoomsPanel from './components/RoomsPanel';
import ResourcesPanel from './components/ResourcesPanel';
import DevicesPanel from './components/DevicesPanel';
import { fetchDeviceStatus, fetchRooms, fetchResources, fetchSurgeriesForDate, saveSurgeryForDate, deleteSurgeryForDate } from './services/api';
import { newId } from './utils/time';

// PUBLIC_INTERFACE
export default function App() {
  /** Main dashboard application wiring the scheduling UI. */
  const [active, setActive] = React.useState('calendar');
  const [rooms, setRooms] = React.useState([]);
  const [resources, setResources] = React.useState({ doctors: [], nurses: [] });
  const [deviceStatus, setDeviceStatus] = React.useState(null);

  const [dateISO, setDateISO] = React.useState(() => new Date().toISOString());
  const [surgeries, setSurgeries] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalInitial, setModalInitial] = React.useState(null);

  // Initial data
  React.useEffect(() => {
    (async () => {
      const [rs, rc, ds] = await Promise.all([fetchRooms(), fetchResources(), fetchDeviceStatus()]);
      setRooms(rs);
      setResources(rc);
      setDeviceStatus(ds);
    })();
  }, []);

  // Load surgeries per date
  React.useEffect(() => {
    (async () => {
      const list = await fetchSurgeriesForDate(dateISO);
      setSurgeries(list);
    })();
  }, [dateISO]);

  const refreshDevices = async () => {
    const ds = await fetchDeviceStatus();
    setDeviceStatus(ds);
  };

  const onNewSurgery = () => {
    setModalInitial(null);
    setModalOpen(true);
  };

  const onOpenSurgery = (s) => {
    setModalInitial(s);
    setModalOpen(true);
  };

  const onSaveSurgery = async (data) => {
    // Ensure id
    const surgery = { id: data.id || newId('surg'), ...data };
    await saveSurgeryForDate(dateISO, surgery);
    const list = await fetchSurgeriesForDate(dateISO);
    setSurgeries(list);
    setModalOpen(false);
  };

  const onDeleteSurgery = async (id) => {
    await deleteSurgeryForDate(dateISO, id);
    const list = await fetchSurgeriesForDate(dateISO);
    setSurgeries(list);
    setModalOpen(false);
  };

  const onDropSurgery = async ({ id, roomId, startTime }) => {
    // Move an existing surgery to a new slot/room; keep duration
    const s = surgeries.find((x) => x.id === id);
    if (!s) return;
    const durationMin = diffMinutes(s.startTime, s.endTime);
    const endTime = addMinutesStr(startTime, durationMin);
    const moved = { ...s, roomId, roomName: rooms.find((r) => r.id === roomId)?.name || roomId, startTime, endTime };
    await saveSurgeryForDate(dateISO, moved);
    const list = await fetchSurgeriesForDate(dateISO);
    setSurgeries(list);
  };

  const onPrevDay = () => {
    const d = new Date(dateISO);
    d.setDate(d.getDate() - 1);
    setDateISO(d.toISOString());
  };
  const onNextDay = () => {
    const d = new Date(dateISO);
    d.setDate(d.getDate() + 1);
    setDateISO(d.toISOString());
  };
  const onToday = () => setDateISO(new Date().toISOString());

  return (
    <div className="app">
      <Sidebar active={active} onNavigate={setActive} />
      <Topbar
        dateISO={dateISO}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onToday={onToday}
        onNewSurgery={onNewSurgery}
        deviceStatus={deviceStatus}
      />
      <main className="main">
        {active === 'calendar' && (
          <Calendar
            rooms={rooms}
            surgeries={surgeries}
            onDropSurgery={onDropSurgery}
            onOpenSurgery={onOpenSurgery}
          />
        )}
        {active === 'rooms' && <RoomsPanel rooms={rooms} />}
        {active === 'resources' && <ResourcesPanel resources={resources} />}
        {active === 'devices' && <DevicesPanel deviceStatus={deviceStatus} onRefresh={refreshDevices} />}
      </main>

      <SurgeryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rooms={rooms}
        resources={resources}
        initial={modalInitial}
        onSave={onSaveSurgery}
        onDelete={onDeleteSurgery}
      />
    </div>
  );
}

// Helpers
function toDate(t) {
  const [h, m] = t.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
}
function diffMinutes(a, b) {
  return Math.max(0, Math.round((toDate(b) - toDate(a)) / 60000));
}
function addMinutesStr(t, min) {
  const d = toDate(t);
  d.setMinutes(d.getMinutes() + min);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
