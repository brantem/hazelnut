import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EmptySection from 'components/sections/EmptySection';

test('EmptySection', async () => {
  const onClick = vi.fn();
  const { container } = render(<EmptySection title="Title" action={{ children: 'Action', onClick }} />);

  expect(container).toMatchSnapshot();
  act(() => screen.getByText('Action').click());
  expect(onClick).toHaveBeenCalled();
});
