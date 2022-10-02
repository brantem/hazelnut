import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Header from 'components/Header';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

test('Header', () => {
  const onActionClick = vi.fn(() => {});
  const { container } = render(
    <Header
      navigations={[
        { icon: <span />, href: '/', text: 'A' },
        { icon: <span />, href: '/b', text: 'B' },
      ]}
      action={{
        onClick: onActionClick,
        text: 'Action',
      }}
    />,
  );

  expect(container).toMatchSnapshot();

  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.queryByText('B')).not.toBeInTheDocument();

  screen.getByText('Action').click();
  expect(onActionClick).toHaveBeenCalled();
});
