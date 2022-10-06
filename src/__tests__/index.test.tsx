import { act, render, screen, renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import Home from 'pages/index';

import { useRoutinesStore } from 'lib/stores';
import { getCurrentDay } from 'lib/helpers';
import { Routine } from 'types/routine';
import days from 'data/days';

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

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: [getCurrentDay()],
  time: dayjs().format('HH:mm'),
  itemIds: [],
  minimized: false,
};

describe('Home', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.remove('routine-1'));
  });

  it('should show active routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.add(routine));

    render(<Home />);

    expect(screen.getByTestId('routine-card')).toBeInTheDocument();
  });

  it("shouldn't show different day routine routine", async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const day = new Date().getDay() + 1;
    act(() => result.current.add({ ...routine, days: [days[day === days.length ? 0 : day]] }));

    render(<Home />);

    expect(screen.queryByTestId('routine-card')).not.toBeInTheDocument();
  });

  it("shouldn't show past routine", async () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.add({ ...routine, time: dayjs().subtract(1, 'hour').format('HH:mm') }));

    render(<Home />);

    expect(screen.queryByTestId('routine-card')).not.toBeInTheDocument();
  });
});
