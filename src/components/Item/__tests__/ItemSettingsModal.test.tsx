import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemSettingsModal from 'components/Item/ItemSettingsModal';

import { useItemsStore, useModalStore } from 'lib/stores';
import { Item } from 'types/item';
import * as constants from 'data/constants';

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

  it('should open edit modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useItemsStore());
    const setItem = vi.spyOn(result.current, 'setItem');

    render(<ItemSettingsModal />);

    act(() => {
      result.current.setItem(item);
      modal.result.current.show(constants.modals.itemSettings);
    });
    act(() => screen.getByText('Edit').click());
    expect(setItem).toHaveBeenCalledWith(item);
    expect(show).toHaveBeenCalledWith(constants.modals.editItem);
    // TODO: check clear
  });

  it('should delete item', () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useItemsStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(<ItemSettingsModal />);

    act(() => {
      result.current.setItem(item);
      modal.result.current.show(constants.modals.itemSettings);
    });
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('item-1');
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
