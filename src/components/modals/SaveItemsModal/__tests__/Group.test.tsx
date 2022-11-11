import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import Group from 'components/modals/SaveItemsModal/Group';

import { Item, ItemType } from 'types/item';
import { Group as _Group } from 'types/group';
import { useItemsStore, useSearchStore } from 'lib/stores';
import * as constants from 'data/constants';

const group: _Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
  createdAt: 0,
};

describe('Group', async () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      items.result.current.add('group-1', {
        id: 'item-2',
        type: ItemType.Number,
        title: 'Item 2',
        settings: { minCompleted: 10, step: 1 },
      } as Item);
      items.result.current.add('group-2', { id: 'item-3', title: 'Item 3' } as Item);
    });
  });

  it('should render successfully', () => {
    const onItemClick = vi.fn(() => {});
    render(<Group group={group} itemIds={['item-1']} onItemClick={onItemClick} />);

    act(() => screen.getByText('Item 1').click());
    expect(onItemClick).toBeCalledWith('item-1', false);

    const item2 = screen.getByText('Item 2');
    expect(item2.parentNode).toHaveTextContent('10');
    act(() => item2.click());
    expect(onItemClick).toBeCalledWith('item-2', true);
  });

  it("should render empty when group doesn't have items", () => {
    render(<Group group={{ ...group, id: 'group-3' }} itemIds={[]} onItemClick={() => {}} />);

    expect(screen.queryByTestId('group')).not.toBeInTheDocument();
  });

  it("should render empty when group doesn't contain searched item", () => {
    const search = renderHook(() => useSearchStore());

    render(<Group group={group} itemIds={[]} onItemClick={() => {}} />);

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.saveItems, 'b'));
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.saveItems, ''));
  });

  it('should be minimizable', () => {
    render(<Group group={group} itemIds={[]} onItemClick={() => {}} />);

    expect(screen.getByTestId('group-items')).toBeInTheDocument();
    act(() => screen.getByTestId('group-minimize').click());
    expect(screen.queryByTestId('group-items')).not.toBeInTheDocument();
  });

  it('should show disabled item', () => {
    const onItemClick = vi.fn(() => {});
    render(<Group group={group} itemIds={['item-1']} disabledItemIds={['item-1']} onItemClick={onItemClick} />);

    act(() => screen.getByText('Item 1').click());
    expect(onItemClick).not.toBeCalledWith('item-1', false);
  });
});
