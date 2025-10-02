//
// Mocked backend API service for the scheduling UI.
// All calls return Promises to mimic async network requests.
//

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const SAMPLE_ROOMS = [
  { id: 'or-1', name: 'OR-1' },
  { id: 'or-2', name: 'OR-2' },
  { id: 'or-3', name: 'OR-3' },
];

const SAMPLE_DOCTORS = [
  { id: 'doc-1', name: 'Dr. Avery', specialty: 'Cardiology' },
  { id: 'doc-2', name: 'Dr. Bailey', specialty: 'Neurosurgery' },
  { id: 'doc-3', name: 'Dr. Karev', specialty: 'Orthopedics' },
];

const SAMPLE_NURSES = [
  { id: 'nurse-1', name: 'Nurse Grey' },
  { id: 'nurse-2', name: 'Nurse Yang' },
  { id: 'nurse-3', name: 'Nurse Stevens' },
];

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export async function fetchDeviceStatus() {
  /** Returns mocked device connection status from Draeger's middleware.
   *  Simulates variance in devices and status with randomization.
   */
  await wait(300);
  const devices = [
    { id: 'dev-vent-1', name: 'Ventilator A', status: Math.random() > 0.2 ? 'connected' : 'warning' },
    { id: 'dev-anes-1', name: 'Anesthesia Machine B', status: Math.random() > 0.1 ? 'connected' : 'disconnected' },
    { id: 'dev-mon-1', name: 'Patient Monitor C', status: Math.random() > 0.05 ? 'connected' : 'error' },
  ];
  return {
    lastUpdated: new Date().toISOString(),
    devices,
  };
}

// PUBLIC_INTERFACE
export async function fetchRooms() {
  /** Returns a list of operating rooms. */
  await wait(200);
  return SAMPLE_ROOMS;
}

// PUBLIC_INTERFACE
export async function fetchResources() {
  /** Returns doctors and nurses available (mock). */
  await wait(200);
  return {
    doctors: SAMPLE_DOCTORS,
    nurses: SAMPLE_NURSES,
  };
}

// PUBLIC_INTERFACE
export async function fetchSurgeriesForDate(dateISO) {
  /** Returns surgeries for a specific date; persisted in localStorage by date key. */
  await wait(250);
  const key = `surgeries:${dateISO.slice(0, 10)}`;
  return loadLocal(key, []);
}

// PUBLIC_INTERFACE
export async function saveSurgeryForDate(dateISO, surgery) {
  /** Saves or updates a surgery for a date in local storage. */
  await wait(200);
  const key = `surgeries:${dateISO.slice(0, 10)}`;
  const list = loadLocal(key, []);
  const existingIdx = list.findIndex((s) => s.id === surgery.id);
  if (existingIdx >= 0) {
    list[existingIdx] = surgery;
  } else {
    list.push(surgery);
  }
  saveLocal(key, list);
  return surgery;
}

// PUBLIC_INTERFACE
export async function deleteSurgeryForDate(dateISO, surgeryId) {
  /** Removes a surgery by ID for the date key. */
  await wait(200);
  const key = `surgeries:${dateISO.slice(0, 10)}`;
  const list = loadLocal(key, []);
  const next = list.filter((s) => s.id !== surgeryId);
  saveLocal(key, next);
  return true;
}
