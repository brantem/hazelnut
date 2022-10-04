import { act, render, screen, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import Stuff from 'pages/stuff';

import { useItemsStore, useGroupsStore } from 'lib/stores';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('Stuff', async () => {
  const items = renderHook(() => useItemsStore());
  act(() => items.result.current.add('group-1', { title: 'Item 1' }));

  const groups = renderHook(() => useGroupsStore());
  act(() => groups.result.current.add({ title: 'Group 1', color: 'red' }));

  render(<Stuff />);

  expect(screen.getByTestId('group-card')).toBeInTheDocument();

  act(() => screen.getByText('Add Group').click());
  expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
});
