import { render, renderHook, act, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import HistoryList from 'components/History/HistoryList';

import { useHistoriesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item } from 'types/item';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  itemIds: ['item-1', 'item-2'],
  time: null,
  days: ['MONDAY'],
  minimized: false,
};

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
};

describe('HistoryList', () => {
  beforeAll(() => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.save(routine, item, true));
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));
  });

  it('should render successfully', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(dayjs().startOf('day').toISOString()));

    render(<HistoryList />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
  });

  it('should render empty when selectedDate is null', async () => {
    render(<HistoryList />);

    expect(screen.queryByText('Routine 1')).not.toBeInTheDocument();
  });
});
