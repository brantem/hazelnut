import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemSettingsModal from 'components/Item/ItemSettingsModal';

import { useItemsStore } from 'lib/stores';
import { Item } from 'types/item';

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
};

describe('ItemSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open settings modal', () => {
    const { result } = renderHook(() => useItemsStore());

    render(<ItemSettingsModal />);

    expect(screen.queryByTestId('item-settings-modal')).not.toBeInTheDocument();
    act(() => result.current.showSettings(item));
    expect(screen.getByTestId('item-settings-modal')).toBeInTheDocument();
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useItemsStore());
    const showEdit = vi.spyOn(result.current, 'showEdit');

    render(<ItemSettingsModal />);

    act(() => result.current.showSettings(item));
    act(() => screen.getByText('Edit').click());
    expect(showEdit).toHaveBeenCalledWith();
    // TODO: check clear
  });

  it('should delete item', () => {
    const { result } = renderHook(() => useItemsStore());
    const remove = vi.spyOn(result.current, 'remove');
    const hide = vi.spyOn(result.current, 'hide');

    render(<ItemSettingsModal />);

    act(() => result.current.showSettings(item));
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('item-1');
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
