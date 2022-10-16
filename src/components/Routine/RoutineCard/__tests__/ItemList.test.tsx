import { render, screen, renderHook, act, within, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Routine/RoutineCard/ItemList';

import { Routine } from 'types/routine';
import { Item } from 'types/item';
import { useHistoriesStore, useItemsStore, useRoutinesStore } from 'lib/stores';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
  minimized: false,
  createdAt: 0,
};

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};

describe('ItemList', () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1', createdAt: 0 } as Routine);
      items.result.current.add('group-1', { id: 'item-2', title: 'Item 2', createdAt: 0 } as Routine);
    });
  });

  it('should render successfully', () => {
    const { container } = render(<ItemList routine={routine} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('routine-item-handle')).not.toBeInTheDocument();
  });

  it('should be sortable', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit');

    const itemIds = ['item-1', 'item-2'];
    const { container } = render(<ItemList routine={{ ...routine, itemIds }} isSortable />);

    expect(container).toMatchSnapshot();
    const item = screen.getByText('Item 2').parentElement!.parentElement!.parentElement!;
    const handle = within(item).getByTestId('routine-item-handle');
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'ArrowUp' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    await expect(edit).toHaveBeenCalledWith('routine-1', { itemIds: ['item-2', 'item-1'] });
  });

  it('should save item', async () => {
    const histories = renderHook(() => useHistoriesStore());
    const save = vi.spyOn(histories.result.current, 'save').mockImplementation(() => {});

    render(<ItemList routine={routine} isSortable />);

    act(() => screen.getByText('Item 1').click());
    expect(save).toHaveBeenCalledWith(routine, item, true);
  });
});
