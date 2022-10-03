import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';

test('useGroupsStore', () => {
  const { result } = renderHook(() => useGroupsStore());

  // add
  expect(result.current.groups).toHaveLength(0);
  act(() => {
    result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as any);
    result.current.add({ id: 'group-2', title: 'Group 2', color: 'amber' } as any);
    result.current.add({ id: 'group-3', title: 'Group 3', color: 'lime' } as any);
  });
  expect(result.current.groups).toHaveLength(3);
  expect(result.current.groups).toEqual([
    { id: 'group-1', title: 'Group 1', color: 'red', items: [] },
    { id: 'group-2', title: 'Group 2', color: 'amber', items: [] },
    { id: 'group-3', title: 'Group 3', color: 'lime', items: [] },
  ]);

  // addItem
  act(() => {
    result.current.addItem('group-1', { id: 'item-1', title: 'Item 1' } as any);
    result.current.addItem('group-1', { id: 'item-2', title: 'Item 2' } as any);
  });
  expect(result.current.groups[0]).toEqual({
    id: 'group-1',
    title: 'Group 1',
    color: 'red',
    items: [
      { id: 'item-1', title: 'Item 1' },
      { id: 'item-2', title: 'Item 2' },
    ],
  });

  // edit
  act(() => result.current.edit('group-1', { title: 'Group 1a', color: 'orange' }));
  expect(result.current.groups[0]).toEqual({
    id: 'group-1',
    title: 'Group 1a',
    color: 'orange',
    items: [
      { id: 'item-1', title: 'Item 1' },
      { id: 'item-2', title: 'Item 2' },
    ],
  });

  // remove
  act(() => result.current.remove(result.current.groups[1].id));
  expect(result.current.groups).toHaveLength(2);

  // removeItem
  act(() => result.current.removeItem('group-1', 'item-1'));
  expect(result.current.groups[0]).toEqual({
    id: 'group-1',
    title: 'Group 1a',
    color: 'orange',
    items: [{ id: 'item-2', title: 'Item 2' }],
  });
});
