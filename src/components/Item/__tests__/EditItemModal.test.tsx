import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import EditItemModal from 'components/Item/EditItemModal';

import { useItemsStore } from 'lib/stores';
import { Item } from 'types/item';

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

    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open edit item modal', () => {
    const { result } = renderHook(() => useItemsStore());

    render(<EditItemModal />);

    expect(screen.queryByTestId('edit-item-modal')).not.toBeInTheDocument();
    act(() => result.current.showEdit(item));
    expect(screen.getByTestId('edit-item-modal')).toBeInTheDocument();
  });

  it('should edit new item', async () => {
    const items = renderHook(() => useItemsStore());
    const edit = vi.spyOn(items.result.current, 'edit');

    const { result } = renderHook(() => useItemsStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<EditItemModal />);

    act(() => result.current.showEdit(item));
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