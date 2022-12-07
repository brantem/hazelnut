import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveItemModal from 'components/Item/SaveItemModal';

import { useGroupsStore, useItemsStore, useModalStore } from 'lib/stores';
import { Group } from 'types/group';
import { Item, ItemType } from 'types/item';
import * as constants from 'data/constants';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
  createdAt: 0,
};

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};

describe('SaveItemModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add item', async () => {
    const modal = renderHook(() => useModalStore());

    const items = renderHook(() => useItemsStore());
    const add = vi.spyOn(items.result.current, 'add');

    const { result } = renderHook(() => useGroupsStore());

    render(<SaveItemModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.saveItem);
    });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Item 1 ' } });
    act(() => screen.getByText('Add').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1', type: ItemType.Bool, settings: {} };
    expect(add).toHaveBeenCalledWith(group.id, values);
  });

  it('should edit item', async () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useItemsStore());
    const edit = vi.spyOn(result.current, 'edit');

    render(<SaveItemModal />);

    act(() => {
      result.current.setItem(item);
      modal.result.current.show(constants.modals.saveItem);
    });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Item 1a ' } });
    act(() => screen.getByText('Save').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1a', type: ItemType.Bool, settings: {} };
    expect(edit).toHaveBeenCalledWith(item.id, values);
  });
});
