import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddItemToGroupModal from 'components/Item/AddItemToGroupModal';

import { useGroupsStore, useItemsStore, useModalStore } from 'lib/stores';
import { Group } from 'types/group';
import * as constants from 'data/constants';

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
  });

  it('should open add item modal', () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useGroupsStore());

    render(<AddItemToGroupModal />);

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.addItemToGroup);
    });
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
  });

  it('should add new item', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const items = renderHook(() => useItemsStore());
    const add = vi.spyOn(items.result.current, 'add');

    const { result } = renderHook(() => useGroupsStore());

    render(<AddItemToGroupModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.addItemToGroup);
    });
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1' };
    expect(add).toHaveBeenCalledWith(group.id, values);
    expect(hide).toHaveBeenCalledWith();
  });
});
