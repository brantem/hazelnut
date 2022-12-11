import { render, renderHook, act, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import HistoryList from 'components/History/HistoryList';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  itemIds: ['item-1', 'item-2'],
  time: null,
  recurrence: {
    startAt: 0,
    interval: 1,
    frequency: 'DAILY',
    days: [],
  },
  minimized: false,
  createdAt: 0,
};

describe('HistoryList', () => {
  beforeAll(async () => {
    const routines = renderHook(() => useRoutinesStore());
    await act(() => routines.result.current.add(routine));

    const { result } = renderHook(() => useHistoriesStore());
    await act(() => result.current.add(routine.id));
  });

  beforeEach(() => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(dayjs().startOf('day').toISOString()));
  });

  it('should render successfully', () => {
    render(<HistoryList />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
  });

  it('should render empty when selectedDate is null', () => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));

    render(<HistoryList />);

    expect(screen.queryByText('Routine 1')).not.toBeInTheDocument();
  });

  it('should support search', () => {
    render(<HistoryList />);

    const search = renderHook(() => useSearch(constants.searches.routines));

    act(() => search.result.current.change('#'));
    expect(screen.getByText('No results found')).toBeInTheDocument();
    act(() => search.result.current.change('1'));
    expect(screen.getByTestId('history-card')).toHaveTextContent('Routine 1');
  });
});
