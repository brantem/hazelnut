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
      result.current.save(routine, item, { done: true });
      result.current.save(
        { ...routine, id: 'routine-2', title: 'Routine 2' },
        { ...item, id: 'item-2', title: 'Item 2' },
        { done: true },
      );
      vi.setSystemTime(dayjs().subtract(1, 'day').toDate());
      result.current.save(routine, item, { done: true });
    });
    vi.useRealTimers();
  });

  afterEach(() => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));
  });

  it('should be selectable', async () => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));

    render(<DateList />);

    const items = screen.getAllByTestId('date-list-item');
    const action = screen.getByTestId('date-list-action');

    expect(items).toHaveLength(2);
    expect(result.current.selectedDate).toBeNull();
    expect(items[0]).toHaveAttribute('aria-selected', 'false');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'true');

    // item
    act(() => items[0].click());
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'false');

    // routine
    act(() => action.click());
    expect(items[0]).toHaveAttribute('aria-selected', 'false');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'true');
  });

  it('should be selectable using keyboard', async () => {
    render(<DateList />);

    const items = screen.getAllByTestId('date-list-item');
    const action = screen.getByTestId('date-list-action');

    expect(items[0]).toHaveAttribute('aria-selected', 'false');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'true');

    // item
    fireEvent.keyDown(items[0], { code: 'Space' });
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'false');

    // item
    fireEvent.keyDown(action, { code: 'Space' });
    expect(items[0]).toHaveAttribute('aria-selected', 'false');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
    expect(action).toHaveAttribute('aria-selected', 'true');
  });
});
