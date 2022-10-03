import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddItemModal from 'components/Item/AddItemModal';

import { useItemsStore, useItemStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('AddItemModal', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useItemStore());
    act(() => {
      result.current.hide();
      result.current.clear();
    });
  });

  it('should open settings modal', () => {
    const { result } = renderHook(() => useItemStore());

    render(<AddItemModal />);

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
    act(() => result.current.showAdd('group-1'));
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
  });

  it('should add new item', async () => {
    const items = renderHook(() => useItemsStore());
    const add = vi.spyOn(items.result.current, 'add');

    const { result } = renderHook(() => useItemStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<AddItemModal />);

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
