import { act, render, screen, renderHook, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Items from 'pages/items';

import { useItemsStore, useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
};

describe('Items', () => {
  beforeAll(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.add('group-1', { title: 'Item 1' }));

    const groups = renderHook(() => useGroupsStore());
    act(() => groups.result.current.add(group));
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should render successfully', async () => {
    render(<Items />);

    expect(screen.getByTestId('group-card')).toBeInTheDocument();

    act(() => screen.getByText('Add Group').click());
    expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
  });

  it('should search', async () => {
    render(<Items />);

    expect(screen.queryByTestId('search')).not.toBeInTheDocument();
    act(() => screen.getByTestId('items-search').click());
    expect(screen.getByTestId('search')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search for group or item titles'), { target: { value: 'a' } });
    expect(screen.getByText('No results found')).toBeInTheDocument();
    act(() => screen.getByTestId('items-search').click());
    expect(screen.queryByTestId('search')).not.toBeInTheDocument();
  });

  it('should clear group', async () => {
    const groups = renderHook(() => useGroupsStore());
    act(() => groups.result.current.setGroup(group));

    render(<Items />);

    expect(groups.result.current.group).not.toBeNull();
    act(() => screen.getByText('Add Group').click());
    expect(groups.result.current.group).toBeNull();
  });
});
