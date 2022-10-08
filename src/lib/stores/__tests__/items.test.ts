import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useItemsStore } from 'lib/stores';
import { Item } from 'types/item';

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
};

describe('useItemsStore', async () => {
  afterEach(() => {
    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.showEdit(item));
    expect(result.current.item).toEqual(item);
    expect(result.current.isEditOpen).toEqual(true);
  });

  it('should hide and reset', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.showEdit(item));
    expect(result.current.item).toEqual(item);
    expect(result.current.isEditOpen).toEqual(true);
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
    expect(result.current.item).toEqual(null);
    expect(result.current.isEditOpen).toEqual(false);
  });

  it('should not reset if isEditOpen is true', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.showEdit(item);
      result.current.resetAfterHide();
    });
    expect(result.current.item).toEqual(item);
  });

  it('should add item', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.items).toHaveLength(0);
    act(() => {
      result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
      result.current.add('group-2', { id: 'item-3', title: 'Item 3' } as Item);
    });
    expect(result.current.items).toEqual([
      { id: 'item-1', groupId: 'group-1', title: 'Item 1' },
      { id: 'item-2', groupId: 'group-1', title: 'Item 2' },
      { id: 'item-3', groupId: 'group-2', title: 'Item 3' },
    ]);
  });

  it('should edit item', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.edit('item-1', { title: 'Item 1a' }));
    expect(result.current.items).toEqual([
      { id: 'item-1', groupId: 'group-1', title: 'Item 1a' },
      { id: 'item-2', groupId: 'group-1', title: 'Item 2' },
      { id: 'item-3', groupId: 'group-2', title: 'Item 3' },
    ]);
  });

  it('should remove item', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.remove('item-1'));
    expect(result.current.items).toEqual([
      { id: 'item-2', groupId: 'group-1', title: 'Item 2' },
      { id: 'item-3', groupId: 'group-2', title: 'Item 3' },
    ]);
  });

  it('should return all items that match groupId', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemsByGroupId('group-2')).toEqual([
      { id: 'item-3', groupId: 'group-2', title: 'Item 3' },
    ]);
  });

  it('should return all items that match the input', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemsByIds(['item-3', 'item-4'])).toEqual([
      { id: 'item-3', groupId: 'group-2', title: 'Item 3' },
    ]);
  });

  it('should return all ids that match the input', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemIdsByIds(['item-3', 'item-4'])).toEqual(['item-3']);
  });
});
