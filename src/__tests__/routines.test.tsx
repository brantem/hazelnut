import { act, render, screen, renderHook, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import Routines from 'pages/routines';

import { useRoutinesStore, useHistoriesStore } from 'lib/stores';
import { Routine } from 'types/routine';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: [],
  minimized: false,
  createdAt: 0,
};

describe('Routines', () => {
  beforeAll(() => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add({ title: 'Routine 2', color: 'red', days: ['MONDAY'], time: '01:00' });
      routines.result.current.add({ title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' });
    });
  });

  beforeEach(() => {
    vi.useFakeTimers();
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('should clear routine', async () => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => routines.result.current.setRoutine(routine));

    render(<Routines />);

    expect(routines.result.current.routine).not.toBeNull();
    act(() => screen.getByText('Add Routine').click());
    expect(routines.result.current.routine).toBeNull();
  });

  it('should show <HistoryList /> and hide search if selectedDate !== currentDate', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const histories = renderHook(() => useHistoriesStore());

    const { rerender } = render(<Routines />);

    expect(screen.getByTestId('routine-list')).toBeInTheDocument();
    act(() => screen.getByTestId('routines-search').click());
    expect(screen.getByTestId('search')).toBeInTheDocument();
    act(() => histories.result.current.setSelectedDate(dayjs().subtract(1, 'day').startOf('day').toISOString()));
    rerender(<Routines />);
    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.queryByTestId('routines-search')).not.toBeInTheDocument();
    expect(screen.queryByTestId('search')).not.toBeInTheDocument();
  });

  it('should move to today when clicking "Add Routine" when selectedDate !== currentDate', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const histories = renderHook(() => useHistoriesStore());

    const { rerender } = render(<Routines />);

    act(() => screen.getByTestId('routines-add').click());
    expect(histories.result.current.selectedDate).toBeNull();
    rerender(<Routines />);
  });
});
