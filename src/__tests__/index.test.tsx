import { act, render, screen, renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import Home from 'pages/index';

import { useRoutinesStore } from 'lib/stores';
import { getCurrentDay } from 'lib/helpers';
import { Routine } from 'types/routine';

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

const generateRoutine = (i: number, days: Routine['days'] = []): Routine => ({
  id: `routine-${i}`,
  title: `Routine ${i}`,
  color: 'red',
  days,
  time: dayjs().format('HH:mm'),
  itemIds: [],
  minimized: false,
});

describe('Home', () => {
  beforeAll(() => {
    vi.fn(getCurrentDay).mockImplementation(() => 'MONDAY');

    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.add(generateRoutine(1, ['MONDAY']));
      result.current.add(generateRoutine(2, ['TUESDAY']));
    });
  });

  it("should show today's routine", async () => {
    render(<Home />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
    expect(screen.queryByText('Routine 2')).not.toBeInTheDocument();
  });
});
