import { render, renderHook, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineList from 'components/Routine/RoutineList';

import { useRoutinesStore } from 'lib/stores';
import { Recurrence } from 'types/shared';

const recurrence: Recurrence = {
  startAt: 0,
  interval: 1,
  frequency: 'DAILY',
  days: [],
};

describe('RoutineList', () => {
  beforeAll(() => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add({ title: 'Routine 2', color: 'red', recurrence, time: '01:00' });
      routines.result.current.add({ title: 'Routine 1', color: 'red', recurrence, time: '00:00' });
    });
  });

  it('should render successfully', async () => {
    render(<RoutineList />);

    const cards = screen.getAllByTestId('routine-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Routine 1');
    expect(cards[1]).toHaveTextContent('Routine 2');
  });
});
