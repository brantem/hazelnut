import dayjs from 'dayjs';
import { render, renderHook, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineList from 'components/Routine/RoutineList';

import { historiesStore, useRoutinesStore } from 'lib/stores';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';
import { getCurrentDay } from 'lib/helpers';
import { daysFromSunday } from 'data/days';

const recurrence = {
  startAt: 0,
  interval: 1,
};

describe('RoutineList', () => {
  beforeAll(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.add({
        title: 'Routine 2',
        color: 'red',
        recurrence: { ...recurrence, frequency: 'DAILY', days: [] },
        time: '01:00',
      });
      const currentDayIndex = daysFromSunday.indexOf(getCurrentDay());
      result.current.add({
        title: 'Routine 1',
        color: 'red',
        recurrence: {
          ...recurrence,
          frequency: 'WEEKLY',
          days: [
            currentDayIndex + 1 === daysFromSunday.length ? daysFromSunday[0] : daysFromSunday[currentDayIndex + 1],
          ],
        },
        time: '00:00',
      });
    });
  });

  it('should render all routines', async () => {
    render(<RoutineList />);

    const cards = screen.getAllByTestId('routine-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Routine 1');
    expect(cards[1]).toHaveTextContent('Routine 2');
  });

  it('should only render active routines if selectedDate === currentDate', async () => {
    await act(() => historiesStore.setState({ selectedDate: dayjs().startOf('day').toISOString() }));
    render(<RoutineList />);

    const cards = screen.getAllByTestId('routine-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Routine 2');
    await act(() => historiesStore.setState({ selectedDate: undefined }));
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
