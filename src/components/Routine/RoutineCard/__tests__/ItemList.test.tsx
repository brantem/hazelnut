import { render, screen, renderHook, act, within, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Routine/RoutineCard/ItemList';

import { Routine } from 'types/routine';
import { Item, ItemType } from 'types/item';
import { useHistoriesStore, useRoutinesStore, useItemsStore } from 'lib/stores';
import colors from 'data/colors';

const generateRoutine = (i: number, data?: Partial<Omit<Routine, 'id' | 'title' | 'color'>>) => {
  const routine = {
    id: `routine-${i}`,
    title: `Routine ${i}`,
    color: colors[(i - 1) % colors.length],
    time: null,
    recurrence: {
      startAt: 0,
      interval: 1,
      frequency: 'DAILY',
      days: [],
    },
    itemIds: [],
    ...(data || {}),
  } as Routine;
  return routine;
};

const routine = generateRoutine(1, { itemIds: ['item-1'] });
const routine2 = generateRoutine(2, { itemIds: ['item-1', 'item-2'] });

const generateItem = (i: number, data?: Partial<Omit<Item, 'id' | 'title'>>) => {
  const item = { id: 'item-' + i, title: 'Item ' + i, ...(data || {}) } as Item;

  if (data?.type === ItemType.Number && !item.settings) item.settings = { minCompleted: 1, step: 1 };

  return item;
};

const item1 = generateItem(1, { groupId: 'group-1', createdAt: 0 });
const item2 = generateItem(2, { groupId: 'group-1', type: ItemType.Number, createdAt: 0 });

describe('ItemList', () => {
  beforeAll(() => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add(routine);
      routines.result.current.add(routine2);
    });

    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', generateItem(1, { createdAt: 0 }));
      items.result.current.add('group-1', generateItem(2, { type: ItemType.Number, createdAt: 0 }));
    });
  });

  it('should render successfully', () => {
    render(<ItemList routine={routine} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('routine-item-handle')).not.toBeInTheDocument();
  });

  it('should be sortable', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit');

    render(<ItemList routine={routine2} isSortable />);

    const item = screen.getByText('Item 2').parentElement!.parentElement!.parentElement!;
    const handle = within(item).getByTestId('routine-item-handle');
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'ArrowUp' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    await expect(edit).toHaveBeenCalledWith(routine2.id, { itemIds: ['item-2', 'item-1'] });
  });

  it('should save item', async () => {
    const histories = renderHook(() => useHistoriesStore());
    const saveItem = vi.spyOn(histories.result.current, 'saveItem');

    render(<ItemList routine={routine} isSortable />);

    act(() => screen.getByText('Item 1').click());
    expect(saveItem).toHaveBeenCalledWith(routine.id, item1.id, { done: true }, true);
    act(() => screen.getByText('Item 1').click());
    expect(saveItem).toHaveBeenCalledWith(routine.id, item1.id, { done: false }, true);
  });

  it('should save number item', async () => {
    const histories = renderHook(() => useHistoriesStore());
    const saveItem = vi.spyOn(histories.result.current, 'saveItem');

    render(<ItemList routine={routine2} isSortable />);

    act(() => screen.getByTestId('number-input-increment').click());
    expect(saveItem).toHaveBeenCalledWith(routine2.id, item2.id, { value: 1, done: true }, true);
    act(() => screen.getByTestId('number-input-decrement').click());
    expect(saveItem).toHaveBeenCalledWith(routine2.id, item2.id, { value: 0, done: false }, true);
  });
});
