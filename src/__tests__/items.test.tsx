import { act, render, screen, renderHook, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Items from 'pages/items';

import { useItemsStore, useGroupsStore, groupsStore } from 'lib/stores';
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
  createdAt: 0,
};

describe('Items', () => {
  beforeAll(async () => {
    const items = renderHook(() => useItemsStore());
    await act(() => items.result.current.add('group-1', { title: 'Item 1' }));

    const groups = renderHook(() => useGroupsStore());
    await act(() => {
      groups.result.current.add(group);
      groups.result.current.setGroup(group);
    });
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should render successfully', async () => {
    const groups = renderHook(() => useGroupsStore());
    const setGroup = vi.spyOn(groups.result.current, 'setGroup').mockImplementation(() => {});

    render(<Items />);

    expect(screen.getByTestId('group-card')).toBeInTheDocument();

    act(() => screen.getByText('Add Group').click());
    expect(setGroup).toHaveBeenCalledWith(null);
    expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
  });

  it('should render empty state successfully', () => {
    act(() => groupsStore.setState({ isReady: true, groups: [] }));

    render(<Items />);

    expect(screen.getByTestId('empty-section-action')).toHaveTextContent('Add Group');

    act(() => groupsStore.setState({ groups: [group] }));
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
});
