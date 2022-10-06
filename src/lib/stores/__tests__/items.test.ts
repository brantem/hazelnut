import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useItemsStore } from 'lib/stores';
import { Item } from 'types/item';

describe('useItemsStore', async () => {
  afterEach(() => {
    const { result } = renderHook(() => useItemsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open add modal', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.showAdd('group-1'));
    expect(result.current.groupId).toEqual('group-1');
    expect(result.current.isAddOpen).toEqual(true);
  });

  it('should hide and reset', () => {
    const { result } = renderHook(() => useItemsStore());
    act(() => result.current.showAdd('group-1'));
    expect(result.current.groupId).toEqual('group-1');
    expect(result.current.isAddOpen).toEqual(true);
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
    expect(result.current.groupId).toEqual(null);
    expect(result.current.isAddOpen).toEqual(false);
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
