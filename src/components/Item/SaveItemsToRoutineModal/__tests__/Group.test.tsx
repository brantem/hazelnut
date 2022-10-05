import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import Group from 'components/Item/SaveItemsToRoutineModal/Group';

import { Item } from 'types/item';
import { Group as _Group } from 'types/group';
import { useItemsStore } from 'lib/stores';

const group: _Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
};

describe('Group', async () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      items.result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
      items.result.current.add('group-2', { id: 'item-3', title: 'Item 3' } as Item);
    });
  });

  it('should render successfully', () => {
    const onItemClick = vi.fn(() => {});
    render(<Group group={group} itemIds={['item-1']} onItemClick={onItemClick} />);

    act(() => screen.getByText('Item 1').click());
    expect(onItemClick).toBeCalledWith(false, 'item-1');

    act(() => screen.getByText('Item 2').click());
    expect(onItemClick).toBeCalledWith(true, 'item-2');
  });

  it('should be minimizable', () => {
    render(<Group group={group} itemIds={[]} onItemClick={() => {}} />);

    expect(screen.getByTestId('group-items')).toBeInTheDocument();
    act(() => screen.getByTestId('group-minimize').click());
    expect(screen.queryByTestId('group-items')).not.toBeInTheDocument();
  });
});
