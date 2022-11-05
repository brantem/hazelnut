import { render, renderHook, act, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import DateList from 'components/Routine/DateList';

import { useHistoriesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item } from 'types/item';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  itemIds: [],
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

describe('DateList', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();

    vi.useFakeTimers();
    const { result } = renderHook(() => useHistoriesStore());
    act(() => {
      vi.setSystemTime(dayjs().subtract(2, 'day').toDate());
      result.current.save(routine, item, true);
      result.current.save(
        { ...routine, id: 'routine-2', title: 'Routine 2' },
        { ...item, id: 'item-2', title: 'Item 2' },
        true,
      );
      vi.setSystemTime(dayjs().subtract(1, 'day').toDate());
      result.current.save(routine, item, true);
    });
    vi.useRealTimers();
  });

  afterEach(() => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));
  });

  it('should render successfully', async () => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));

    render(<DateList />);

    const items = screen.getAllByTestId('date-list-item');
    expect(items).toHaveLength(3);
    expect(result.current.selectedDate).toBeNull();
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'false');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'true');
    act(() => items[1].click());
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'true');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'false');
  });

  it('should be selectable', async () => {
    render(<DateList />);

    const items = screen.getAllByTestId('date-list-item');
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'false');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(items[1], { code: 'Space' });
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'true');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'false');
  });
});
