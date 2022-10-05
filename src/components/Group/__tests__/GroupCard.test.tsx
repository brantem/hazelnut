import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { Item } from 'types/item';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
};

describe('GroupCard', () => {
  beforeEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item));
  });

  afterEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));
  });

  it('should render successfully', () => {
    const items = renderHook(() => useItemsStore());
    const showAdd = vi.spyOn(items.result.current, 'showAdd').mockImplementation(() => {});

    const { result } = renderHook(() => useGroupsStore());
    const showSettings = vi.spyOn(result.current, 'showSettings').mockImplementation(() => {});

    const { container } = render(<GroupCard group={group} />);

    expect(container).toMatchSnapshot();
    expect(screen.getAllByTestId('group-card-items-item')).toHaveLength(1);

    act(() => screen.getByText('Add Item').click());
    expect(showAdd).toHaveBeenCalledWith('group-1');

    act(() => screen.getByTestId('group-card-settings').click());
    expect(showSettings).toHaveBeenCalledWith(group);
  });

  it('should render empty group', () => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));

    const { container } = render(<GroupCard group={group} />);

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });

  it('should remove item', () => {
    const items = renderHook(() => useItemsStore());
    const remove = vi.spyOn(items.result.current, 'remove');

    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.add(group as Group));

    const { rerender } = render(<GroupCard group={result.current.groups[0]} />);

    expect(screen.getByTestId('group-card-items-item')).toBeInTheDocument();
    act(() => screen.getByTestId('delete-button').click());
    act(() => screen.getByTestId('delete-button-confirm').click());
    expect(remove).toHaveBeenCalledWith('item-1');
    rerender(<GroupCard group={result.current.groups[0]} />);
    expect(screen.queryByTestId('group-card-items-item')).not.toBeInTheDocument();
  });
});
