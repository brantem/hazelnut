import { render, screen, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Group/GroupCard/ItemList';

import { Group } from 'types/group';
import { useItemsStore, useSearchStore } from 'lib/stores';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
};

describe('ItemList', () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Group);
      items.result.current.add('group-2', { id: 'item-2', title: 'Item 2' } as Group);
    });
  });

  it('should render successfully', () => {
    const { container } = render(<ItemList group={group} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('should remove item', () => {
    const { result } = renderHook(() => useItemsStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(
      <ItemList
        group={{
          id: 'group-2',
          title: 'Group 2',
          color: 'red',
          minimized: false,
        }}
      />,
    );

    expect(screen.getByText('Item 2')).toBeInTheDocument();
    act(() => screen.getByTestId('delete-button').click());
    act(() => screen.getByTestId('delete-button-confirm').click());
    expect(remove).toHaveBeenCalledWith('item-2');
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('should render empty there is no items', () => {
    render(
      <ItemList
        group={{
          id: 'group-3',
          title: 'Group 3',
          color: 'red',
          minimized: false,
        }}
      />,
    );

    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });

  it('should render empty there is no items that contains search value', () => {
    const search = renderHook(() => useSearchStore('items'));

    render(<ItemList group={group} />);

    expect(screen.getByTestId('group-card-items')).toBeInTheDocument();
    act(() => search.result.current.setSearch('a'));
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });
});
