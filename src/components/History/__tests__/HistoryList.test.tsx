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
  recurrence: {
    startAt: 0,
    interval: 1,
    frequency: 'DAILY',
    days: [],
  },
  minimized: false,
  createdAt: 0,
};

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};

describe('HistoryList', () => {
  beforeAll(async () => {
    const { result } = renderHook(() => useHistoriesStore());
    await act(() => result.current.save(routine, item, true));
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    const { result } = renderHook(() => useHistoriesStore());
    await act(() => result.current.setSelectedDate(null));
  });

  it('should render successfully', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    await act(() => result.current.setSelectedDate(dayjs().startOf('day').toISOString()));

    render(<HistoryList />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
  });

  it('should render empty when selectedDate is null', async () => {
    render(<HistoryList />);

    expect(screen.queryByText('Routine 1')).not.toBeInTheDocument();
  });
});
