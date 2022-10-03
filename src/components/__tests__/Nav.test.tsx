import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Nav from 'components/Nav';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

test('Nav', () => {
  const { container } = render(
    <Nav
      navigations={[
        { icon: <span />, href: '/', text: 'A' },
        { icon: <span />, href: '/b', text: 'B' },
      ]}
    />,
  );

  expect(container).toMatchSnapshot();
  expect(screen.getByText('A').parentNode).toHaveAttribute('aria-current', 'page');
  expect(screen.queryByText('B')).not.toBeInTheDocument();
});
