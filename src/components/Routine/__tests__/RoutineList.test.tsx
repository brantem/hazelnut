import { render, renderHook, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineList from 'components/Routine/RoutineList';

import { useRoutinesStore } from 'lib/stores';
import { Recurrence } from 'types/shared';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const recurrence: Recurrence = {
  startAt: 0,
  interval: 1,
  frequency: 'DAILY',
  days: [],
};

describe('RoutineList', () => {
  beforeAll(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.add({ title: 'Routine 2', color: 'red', recurrence, time: '01:00' });
      result.current.add({ title: 'Routine 1', color: 'red', recurrence, time: '00:00' });
    });
  });

  it('should render successfully', async () => {
    render(<RoutineList />);

    const cards = screen.getAllByTestId('routine-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Routine 1');
    expect(cards[1]).toHaveTextContent('Routine 2');
  });

  it('should support search', async () => {
    render(<RoutineList />);

    const search = renderHook(() => useSearch(constants.searches.routines));

    expect(screen.getAllByTestId('routine-card')).toHaveLength(2);
    act(() => search.result.current.change('#'));
    expect(screen.getByText('No results found')).toBeInTheDocument();
    act(() => search.result.current.change('1'));
    expect(screen.getByTestId('routine-card')).toHaveTextContent('Routine 1');
  });
});
