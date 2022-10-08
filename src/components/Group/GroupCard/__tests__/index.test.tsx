import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

import { useGroupsStore, useItemsStore, useSearchStore } from 'lib/stores';
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
    const { result } = renderHook(() => useGroupsStore());
    const showAddItem = vi.spyOn(result.current, 'showAddItem').mockImplementation(() => {});
    const showSettings = vi.spyOn(result.current, 'showSettings').mockImplementation(() => {});

    const { container } = render(<GroupCard group={group} />);

    expect(container).toMatchSnapshot();
    act(() => screen.getByTestId('group-card-add-item').click());
    expect(showAddItem).toHaveBeenCalledWith(group);

    act(() => screen.getByTestId('group-card-settings').click());
    expect(showSettings).toHaveBeenCalledWith(group);
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
    const search = renderHook(() => useSearchStore('items'));

    render(
      <GroupCard
        group={{
          id: 'group-2',
          title: 'Group 2',
          color: 'red',
          minimized: false,
        }}
      />,
    );

    expect(screen.getByText('Group 2')).toBeInTheDocument();
    act(() => search.result.current.setSearch('b'));
    expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
    act(() => search.result.current.setSearch(''));
  });

  it("should render empty when group doesn't contain search value", () => {
    const search = renderHook(() => useSearchStore('items'));

    render(<GroupCard group={group} />);

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    act(() => search.result.current.setSearch('b'));
    expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
    act(() => search.result.current.setSearch(''));
  });
});
