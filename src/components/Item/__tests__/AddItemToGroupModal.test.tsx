import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddItemToGroupModal from 'components/Item/AddItemToGroupModal';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
};

describe('AddItemToGroupModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;

    const { result } = renderHook(() => useGroupsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open settings modal', () => {
    const { result } = renderHook(() => useGroupsStore());

    render(<AddItemToGroupModal />);

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
    act(() => result.current.showAddItem(group));
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
  });

  it('should add new item', async () => {
    const items = renderHook(() => useItemsStore());
    const add = vi.spyOn(items.result.current, 'add');

    const { result } = renderHook(() => useGroupsStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<AddItemToGroupModal />);

    act(() => result.current.showAddItem(group));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1' };
    expect(add).toHaveBeenCalledWith(group.id, values);
    expect(hide).toHaveBeenCalled();
  });
});
