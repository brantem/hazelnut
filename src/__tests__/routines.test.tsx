import { act, render, screen, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import Routines from 'pages/routines';

import { useRoutinesStore } from 'lib/stores';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('Routines', async () => {
  const { result } = renderHook(() => useRoutinesStore());
  act(() => {
    result.current.add({ title: 'Routine 2', color: 'red', days: ['MONDAY'], time: '01:00' });
    result.current.add({ title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' });
  });

  render(<Routines />);

  const cards = screen.getAllByTestId('routine-card');
  expect(cards).toHaveLength(2);
  expect(cards[0]).toHaveTextContent('Routine 1');
  expect(cards[1]).toHaveTextContent('Routine 2');

  act(() => screen.getByText('Add Routine').click());
  expect(screen.getByTestId('save-routine-modal')).toBeInTheDocument();
});
