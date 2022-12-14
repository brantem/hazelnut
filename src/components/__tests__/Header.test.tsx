import { render, screen, act } from '@testing-library/react';
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
      actions={[
        {
          children: 'Action 1',
          onClick: onActionClick,
        },
        {
          children: 'Action 2',
          onClick: () => {},
          skip: true,
        },
        { render: () => <span>Action 3</span> },
      ]}
    />,
  );

  expect(container).toMatchSnapshot();

  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.queryByText('B')).not.toBeInTheDocument();

  act(() => screen.getByText('Action 1').click());
  expect(onActionClick).toHaveBeenCalled();
  expect(screen.queryByText('Action 2')).not.toBeInTheDocument();
  expect(screen.getByText('Action 3')).toBeInTheDocument();
});
