import { act, render, screen, renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import Router from 'next/router';
import '@testing-library/jest-dom';

import Home from 'pages/index';

import { Routine } from 'types/routine';
import { routinesStore, useRoutinesStore } from 'lib/stores';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
  default: {
    push: vi.fn(),
  },
}));

const routine: Routine = {
  id: 'routine-1',
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
  minimized: false,
  createdAt: Date.now(),
};

describe('Home', () => {
  afterEach(() => {
    act(() => routinesStore.setState({ isReady: true, routines: [] }));
  });

  it('should render successfully', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.add(routine);
    });

    render(<Home />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
  });

  it('should render empty state successfully', () => {
    render(<Home />);

    const action = screen.getByTestId('empty-section-action');
    expect(action).toHaveTextContent('Add Routine');
    act(() => action.click());
    expect(Router.push).toHaveBeenCalledWith('/routines');
  });
});
