import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useItemsStore } from 'lib/stores';
import { Item } from 'types/item';

test('useItemsStore', async () => {
  const { result } = renderHook(() => useItemsStore());

  // add
  expect(result.current.items).toHaveLength(0);
  act(() => {
    result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
    result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
  });
  expect(result.current.items).toEqual([
    { id: 'item-1', groupId: 'group-1', title: 'Item 1' },
    { id: 'item-2', groupId: 'group-1', title: 'Item 2' },
  ]);

  // edit
  act(() => result.current.edit('item-1', { title: 'Item 1a' }));
  expect(result.current.items).toEqual([
    { id: 'item-1', groupId: 'group-1', title: 'Item 1a' },
    { id: 'item-2', groupId: 'group-1', title: 'Item 2' },
  ]);

  // remove
  act(() => result.current.remove('item-1'));
  expect(result.current.items).toEqual([{ id: 'item-2', groupId: 'group-1', title: 'Item 2' }]);
});
