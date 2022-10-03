import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

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
});
