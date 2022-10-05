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
  minimized: false,
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

    act(() => screen.getByTestId('group-card-add-item').click());
    expect(showAdd).toHaveBeenCalledWith('group-1');

    act(() => screen.getByTestId('group-card-settings').click());
    expect(showSettings).toHaveBeenCalledWith(group);
  });

  it('should remove item', () => {
    const items = renderHook(() => useItemsStore());
    const remove = vi.spyOn(items.result.current, 'remove');

    const { rerender } = render(<GroupCard group={group} />);

    expect(screen.getByTestId('group-card-items-item')).toBeInTheDocument();
    act(() => screen.getByTestId('delete-button').click());
    act(() => screen.getByTestId('delete-button-confirm').click());
    expect(remove).toHaveBeenCalledWith('item-1');
    rerender(<GroupCard group={group} />);
    expect(screen.queryByTestId('group-card-items-item')).not.toBeInTheDocument();
  });

  it('should be minimizable', () => {
    const { result } = renderHook(() => useGroupsStore());
    const edit = vi.spyOn(result.current, 'edit').mockImplementation(() => {});

    const { rerender } = render(<GroupCard group={group} />);

    expect(screen.getByTestId('group-card-items')).toBeInTheDocument();
    act(() => screen.getByTestId('group-card-minimize').click());
    expect(edit).toHaveBeenCalledWith('group-1', { minimized: true });
    rerender(<GroupCard group={{ ...group, minimized: true }} />);
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });
});
