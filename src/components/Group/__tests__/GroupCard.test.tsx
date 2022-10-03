import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

import { useGroupsStore } from 'lib/stores';

describe('GroupCard', () => {
  it('should render successfully', () => {
    const onAddItemClick = vi.fn(() => {});
    const onSettingsClick = vi.fn(() => {});
    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red', items: [{ id: 'item-1', title: 'Item 1' }] }}
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
    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red', items: [] }}
        onAddItemClick={() => {}}
        onSettingsClick={() => {}}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });

  it('should remove item', () => {
    const group = {
      id: 'group-1',
      title: 'Group 1',
      color: 'red',
      items: [{ id: 'item-1', title: 'Item 1' }],
    };
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.add(group as any));
    const removeItem = vi.spyOn(result.current, 'removeItem');

    const { rerender } = render(
      <GroupCard group={result.current.groups[0]} onAddItemClick={() => {}} onSettingsClick={() => {}} />,
    );

    expect(screen.getByTestId('group-card-items-item')).toBeInTheDocument();
    act(() => screen.getByTestId('delete-button').click());
    act(() => screen.getByTestId('delete-button-confirm').click());
    expect(removeItem).toHaveBeenCalledWith('group-1', 'item-1');
    rerender(<GroupCard group={result.current.groups[0]} onAddItemClick={() => {}} onSettingsClick={() => {}} />);
    expect(screen.queryByTestId('group-card-items-item')).not.toBeInTheDocument();
  });
});
