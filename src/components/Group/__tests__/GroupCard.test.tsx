import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

describe('GroupCard', () => {
  it('should render successfully', () => {
    const onSettingsClick = vi.fn(() => {});
    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red', items: ['Item 1'] }}
        onSettingsClick={onSettingsClick}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getAllByTestId('group-card-items-item')).toHaveLength(1);
    act(() => screen.getByTestId('group-card-settings').click());
    expect(onSettingsClick).toHaveBeenCalled();
  });

  it('should render empty group', () => {
    const onSettingsClick = vi.fn(() => {});
    const { container } = render(
      <GroupCard
        group={{ id: 'group-1', title: 'Group 1', color: 'red', items: [] }}
        onSettingsClick={onSettingsClick}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByTestId('group-card-items')).not.toBeInTheDocument();
  });
});
