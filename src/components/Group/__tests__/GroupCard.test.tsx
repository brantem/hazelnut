import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupCard from 'components/Group/GroupCard';

test('GroupCard', async () => {
  const onSettingsClick = vi.fn(() => {});
  const { container } = render(
    <GroupCard
      group={{ id: 'group-1', title: 'Group 1', color: 'red', items: ['Item 1'] }}
      onSettingsClick={onSettingsClick}
    />,
  );

  expect(container).toMatchSnapshot();
  act(() => screen.getByTestId('group-card-settings').click());
  expect(onSettingsClick).toHaveBeenCalled();
});
