import { render, screen, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Group/GroupCard/ItemList';

import { Group } from 'types/group';
import { useItemsStore, useModalStore, useSearchStore } from 'lib/stores';
import * as constants from 'data/constants';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
  createdAt: 0,
};

describe('ItemList', () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1', createdAt: 0 } as Group);
      items.result.current.add('group-2', { id: 'item-2', title: 'Item 2', createdAt: 0 } as Group);
    });
  });

  it('should render successfully', () => {
    render(<ItemList group={group} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('should open settings modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useItemsStore());
    const setItem = vi.spyOn(result.current, 'setItem').mockImplementation(() => {});

    render(<ItemList group={group} />);

    act(() => screen.getByTestId('group-item-settings').click());
    expect(setItem).toHaveBeenCalledWith({ groupId: 'group-1', id: 'item-1', title: 'Item 1', createdAt: 0 });
    expect(show).toHaveBeenCalledWith(constants.modals.itemSettings);
  });

  it('should render empty there is no items', () => {
    render(
      <ItemList
        group={{
          id: 'group-3',
          title: 'Group 3',
          color: 'red',
          minimized: false,
          createdAt: 0,
        }}
      />,
    );

    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });

  it('should render empty there is no items that contains search value', () => {
    const search = renderHook(() => useSearchStore());

    render(<ItemList group={group} />);

    expect(screen.getByTestId('group-card-items')).toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.items, 'a'));
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });
});
