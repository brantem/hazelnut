import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddItemToGroupModal from 'components/Item/AddItemToGroupModal';

import { useItemsStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('AddItemToGroupModal', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open settings modal', () => {
    const { result } = renderHook(() => useItemsStore());

    render(<AddItemToGroupModal />);

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
    act(() => result.current.showAdd('group-1'));
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
  });

  it('should add new item', async () => {
    const { result } = renderHook(() => useItemsStore());
    const add = vi.spyOn(result.current, 'add');
    const hide = vi.spyOn(result.current, 'hide');

    render(<AddItemToGroupModal />);

    act(() => result.current.showAdd('group-1'));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1' };
    expect(add).toHaveBeenCalledWith('group-1', values);
    expect(hide).toHaveBeenCalled();
  });
});
