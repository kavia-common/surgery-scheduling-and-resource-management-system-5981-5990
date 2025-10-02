import { render, screen } from '@testing-library/react';
import App from './App';

test('renders surgery scheduler UI', () => {
  render(<App />);
  const banner = screen.getByRole('banner');
  expect(banner).toBeInTheDocument();
  const nav = screen.getByLabelText(/Sidebar navigation/i);
  expect(nav).toBeInTheDocument();
});
