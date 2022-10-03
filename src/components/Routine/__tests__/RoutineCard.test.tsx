import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineCard from 'components/Routine/RoutineCard';

test('RoutineCard', () => {
  const onSettingsClick = vi.fn(() => {});
  const { container } = render(
    <RoutineCard routine={{ id: 'routine-1', title: 'Routine 1', color: 'red' }} onSettingsClick={onSettingsClick} />,
  );

  expect(container).toMatchSnapshot();

  act(() => screen.getByTestId('routine-card-settings').click());
  expect(onSettingsClick).toHaveBeenCalled();
});
