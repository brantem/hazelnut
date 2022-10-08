import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditItemModal from 'components/Item/EditItemModal';

import { useItemsStore, useModalStore } from 'lib/stores';
import { Item } from 'types/item';
import * as constants from 'data/constants';

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
};

describe('EditItemModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open edit item modal', () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useItemsStore());

    render(<EditItemModal />);

    expect(screen.queryByTestId('edit-item-modal')).not.toBeInTheDocument();
    act(() => {
      result.current.setItem(item);
      modal.result.current.show(constants.modals.editItem);
    });
    expect(screen.getByTestId('edit-item-modal')).toBeInTheDocument();
  });

  it('should edit new item', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useItemsStore());
    const edit = vi.spyOn(result.current, 'edit');

    render(<EditItemModal />);

    act(() => {
      result.current.setItem(item);
      modal.result.current.show(constants.modals.editItem);
    });
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1a' } });
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1a' };
    expect(edit).toHaveBeenCalledWith(item.id, values);
    expect(hide).toHaveBeenCalled();
  });
});
