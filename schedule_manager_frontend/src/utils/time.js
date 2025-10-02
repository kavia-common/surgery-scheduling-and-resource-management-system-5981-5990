//
// Time utilities for calendar slots and formatting
//

// PUBLIC_INTERFACE
export function formatTime(date) {
  /** Format Date to HH:mm string */
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// PUBLIC_INTERFACE
export function parseTime(str) {
  /** Parse HH:mm to Date today */
  const [h, m] = str.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// PUBLIC_INTERFACE
export function addMinutes(date, minutes) {
  /** Return new Date with minutes added */
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

// PUBLIC_INTERFACE
export function generateTimeSlots(start = '07:00', end = '19:00', stepMin = 30) {
  /** Generate time slots from start to end inclusive (last boundary included). */
  const slots = [];
  let cur = parseTime(start);
  const endD = parseTime(end);
  while (cur <= endD) {
    slots.push(formatTime(cur));
    cur = addMinutes(cur, stepMin);
  }
  return slots;
}

// PUBLIC_INTERFACE
export function isOverlap(aStart, aEnd, bStart, bEnd) {
  /** Returns true if time ranges overlap (open/closed properly) */
  const aS = parseTime(aStart).getTime();
  const aE = parseTime(aEnd).getTime();
  const bS = parseTime(bStart).getTime();
  const bE = parseTime(bEnd).getTime();
  return aS < bE && bS < aE;
}

// PUBLIC_INTERFACE
export function newId(prefix = 'id') {
  /** Create a simple unique-like id */
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
