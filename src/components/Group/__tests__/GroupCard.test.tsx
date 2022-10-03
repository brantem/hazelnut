import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

import { useGroupsStore, useItemsStore } from 'lib/stores';

describe('GroupCard', () => {
  beforeEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as any));
  });

  afterEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));
  });

  it('should render successfully', () => {
    const onAddItemClick = vi.fn(() => {});
    const onSettingsClick = vi.fn(() => {});
    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red' }}
        onAddItemClick={onAddItemClick}
        onSettingsClick={onSettingsClick}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getAllByTestId('group-card-items-item')).toHaveLength(1);

    act(() => screen.getByText('Add Item').click());
    expect(onAddItemClick).toHaveBeenCalled();

    act(() => screen.getByTestId('group-card-settings').click());
    expect(onSettingsClick).toHaveBeenCalled();
  });

  it('should render empty group', () => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));

    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red' }}
        onAddItemClick={() => {}}
        onSettingsClick={() => {}}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });

  it('should remove item', () => {
    const items = renderHook(() => useItemsStore());
    const remove = vi.spyOn(items.result.current, 'remove');

    const groups = renderHook(() => useGroupsStore());
    act(() => groups.result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as any));

    const { rerender } = render(
      <GroupCard group={groups.result.current.groups[0]} onAddItemClick={() => {}} onSettingsClick={() => {}} />,
    );

    expect(screen.getByTestId('group-card-items-item')).toBeInTheDocument();
    act(() => screen.getByTestId('delete-button').click());
    act(() => screen.getByTestId('delete-button-confirm').click());
    expect(remove).toHaveBeenCalledWith('item-1');
    rerender(
      <GroupCard group={groups.result.current.groups[0]} onAddItemClick={() => {}} onSettingsClick={() => {}} />,
    );
    expect(screen.queryByTestId('group-card-items-item')).not.toBeInTheDocument();
  });
});
