import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EmptySection from 'components/sections/EmptySection';

test('EmptySection', async () => {
  const onClick = vi.fn();
  const { container } = render(<EmptySection title="Title" action={{ onClick, text: 'Action' }} />);

  expect(container).toMatchSnapshot();
  act(() => screen.getByText('Action').click());
  expect(onClick).toHaveBeenCalled();
});
