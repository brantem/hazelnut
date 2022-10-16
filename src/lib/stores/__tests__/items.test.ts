import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useItemsStore } from 'lib/stores';
import storage from 'lib/stores/storage';

const generateItem = (i: number, groupId = 'group-1') => {
  const item: any = {
    id: 'item-' + i,
    title: 'Item ' + i,
    createdAt: 0,
  };
  if (groupId) item.groupId = groupId;
  return item;
};

describe('useItemsStore', () => {
  it('should set item', async () => {
    const { result } = renderHook(() => useItemsStore());
    await act(() => result.current.setItem(generateItem(1)));
    expect(result.current.item).toEqual(generateItem(1));
    await act(() => result.current.setItem(null));
    expect(result.current.item).toBeNull();
  });

  it('should add item', async () => {
    const add = vi.spyOn(storage, 'add');

    const { result } = renderHook(() => useItemsStore());
    expect(result.current.items).toHaveLength(0);
    await act(() => {
      result.current.add('group-1', generateItem(1, ''));
      result.current.add('group-1', generateItem(2, ''));
      result.current.add('group-2', generateItem(3, ''));
    });
    expect(result.current.items).toEqual([
      generateItem(1, 'group-1'),
      generateItem(2, 'group-1'),
      generateItem(3, 'group-2'),
    ]);
    expect(add).toHaveBeenCalledWith('items', generateItem(1, 'group-1'));
    expect(add).toHaveBeenCalledWith('items', generateItem(2, 'group-1'));
    expect(add).toHaveBeenCalledWith('items', generateItem(3, 'group-2'));
  });

  it(`should cancel when trying to update item that doesn't exist`, async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useItemsStore());
    const values = { title: 'Item 1a' };
    await act(() => result.current.edit('item-1a', values));
    expect(result.current.items).toEqual([
      generateItem(1, 'group-1'),
      generateItem(2, 'group-1'),
      generateItem(3, 'group-2'),
    ]);
    expect(put).not.toHaveBeenCalled();
  });

  it('should edit item', async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useItemsStore());
    const values = { title: 'Item 1a' };
    await act(() => result.current.edit('item-1', values));
    expect(result.current.items).toEqual([
      { ...generateItem(1, 'group-1'), ...values },
      generateItem(2, 'group-1'),
      generateItem(3, 'group-2'),
    ]);
    expect(put).toHaveBeenCalledWith('items', { ...generateItem(1, 'group-1'), ...values });
  });

  it('should remove item', async () => {
    const { result } = renderHook(() => useItemsStore());
    await act(() => result.current.remove('item-1'));
    expect(result.current.items).toEqual([generateItem(2, 'group-1'), generateItem(3, 'group-2')]);
  });

  it('should return all items that match groupId', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemsByGroupId('group-2')).toEqual([generateItem(3, 'group-2')]);
  });

  it('should return all items that match the input', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemsByIds(['item-3', 'item-4'])).toEqual([generateItem(3, 'group-2')]);
  });

  it('should return all ids that match the input', () => {
    const { result } = renderHook(() => useItemsStore());
    expect(result.current.getItemIdsByIds(['item-3', 'item-4'])).toEqual(['item-3']);
  });
});
