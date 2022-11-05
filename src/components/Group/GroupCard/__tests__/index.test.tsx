import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

import { useGroupsStore, useItemsStore, useModalStore, useSearchStore } from 'lib/stores';
import { Item } from 'types/item';
import { Group } from 'types/group';
import * as constants from 'data/constants';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
  createdAt: 0,
};

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};

describe('GroupCard', () => {
  beforeEach(async () => {
    const items = renderHook(() => useItemsStore());
    await act(() => {
      items.result.current.add('group-1', item);
      items.result.current.setItem(item);
    });
  });

  afterEach(async () => {
    const items = renderHook(() => useItemsStore());
    await act(() => items.result.current.remove('item-1'));
  });

  it('should render successfully', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useGroupsStore());
    const setGroup = vi.spyOn(result.current, 'setGroup').mockImplementation(() => {});

    const items = renderHook(() => useItemsStore());
    const setItem = vi.spyOn(items.result.current, 'setItem').mockImplementation(() => {});

    render(<GroupCard group={group} />);

    act(() => screen.getByTestId('group-card-add-item').click());
    expect(setGroup).toHaveBeenCalledWith(group);
    expect(setItem).toHaveBeenCalledWith(null);
    expect(show).toHaveBeenCalledWith(constants.modals.saveItem);

    act(() => screen.getByTestId('group-card-settings').click());
    expect(setGroup).toHaveBeenCalledWith(group);
    expect(show).toHaveBeenCalledWith(constants.modals.groupSettings);
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

  it("should render empty when group title doesn't contain search value", () => {
    const search = renderHook(() => useSearchStore());

    render(
      <GroupCard
        group={{
          id: 'group-2',
          title: 'Group 2',
          color: 'red',
          minimized: false,
          createdAt: 0,
        }}
      />,
    );

    expect(screen.getByText('Group 2')).toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.items, 'b'));
    expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.items, ''));
  });

  it("should render empty when group doesn't contain search value", () => {
    const search = renderHook(() => useSearchStore());

    render(<GroupCard group={group} />);

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.items, 'b'));
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    act(() => search.result.current.setSearch(constants.searches.items, ''));
  });
});
