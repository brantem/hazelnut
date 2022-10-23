import { act, render, screen, renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import Home from 'pages/index';

import { useRoutinesStore } from 'lib/stores';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

test('Home', () => {
  const { result } = renderHook(() => useRoutinesStore());
  act(() => {
    result.current.add({
      title: 'Routine 1',
      color: 'red',
      recurrence: {
        startAt: 0,
        interval: 1,
        frequency: 'DAILY',
        days: [],
      },
      time: dayjs().format('HH:mm'),
      itemIds: [],
    });
  });

  render(<Home />);

  expect(screen.getByText('Routine 1')).toBeInTheDocument();
});
