import { act, render, screen, renderHook, fireEvent } from '@testing-library/react';
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

describe('Routines', () => {
  beforeAll(() => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add({ title: 'Routine 2', color: 'red', days: ['MONDAY'], time: '01:00' });
      routines.result.current.add({ title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' });
    });
  });

  it('should render successfully', async () => {
    render(<Routines />);

    const cards = screen.getAllByTestId('routine-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Routine 1');
    expect(cards[1]).toHaveTextContent('Routine 2');

    act(() => screen.getByText('Add Routine').click());
    expect(screen.getByTestId('save-routine-modal')).toBeInTheDocument();
  });

  it('should search', async () => {
    render(<Routines />);

    expect(screen.queryByTestId('search')).not.toBeInTheDocument();
    act(() => screen.getByTestId('routines-search').click());
    expect(screen.getByTestId('search')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search for routine titles'), { target: { value: 'a' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
    act(() => screen.getByTestId('routines-search').click());
    expect(screen.queryByTestId('search')).not.toBeInTheDocument();
  });
});
