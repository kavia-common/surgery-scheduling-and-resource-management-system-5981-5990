//
// Ocean Professional theme constants and helpers
//

export const COLORS = {
  primary: '#2563EB', // Blue
  secondary: '#F59E0B', // Amber
  success: '#F59E0B', // Amber as success accent
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  shadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
};

export const ROUNDED = {
  sm: '8px',
  md: '10px',
  lg: '14px',
};

export const TRANSITION = 'all 200ms ease';

export const gradientBg = (from = 'rgba(59,130,246,0.08)', to = '#ffffff') =>
  `linear-gradient(180deg, ${from} 0%, ${to} 100%)`;
