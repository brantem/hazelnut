import { render, screen, renderHook, act, within, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Routine/RoutineCard/ItemList';

import { Routine } from 'types/routine';
import { useItemsStore, useRoutinesStore } from 'lib/stores';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
  minimized: false,
};

describe('ItemList', () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Routine);
      items.result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Routine);
    });
  });

  it('should render successfully', () => {
    const { container } = render(<ItemList routine={routine} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('routine-card-items-item-handle')).not.toBeInTheDocument();
  });

  it('should be sortable', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit');

    const itemIds = ['item-1', 'item-2'];
    const { container } = render(<ItemList routine={{ ...routine, itemIds }} isSortable />);

    expect(container).toMatchSnapshot();
    const item = screen.getByText('Item 2').parentElement!.parentElement!;
    const handle = within(item).getByTestId('routine-card-items-item-handle');
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'ArrowUp' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    fireEvent.keyDown(handle, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    await expect(edit).toHaveBeenCalledWith('routine-1', { itemIds: ['item-2', 'item-1'] });
  });
});
