import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

test('useGroupsStore', () => {
  const { result } = renderHook(() => useGroupsStore());

  // add
  expect(result.current.groups).toHaveLength(0);
  act(() => {
    result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as Group);
    result.current.add({ id: 'group-2', title: 'Group 2', color: 'amber' } as Group);
  });
  expect(result.current.groups).toEqual([
    { id: 'group-1', title: 'Group 1', color: 'red' },
    { id: 'group-2', title: 'Group 2', color: 'amber' },
  ]);

  // edit
  act(() => result.current.edit('group-1', { title: 'Group 1a', color: 'orange' }));
  expect(result.current.groups).toEqual([
    { id: 'group-1', title: 'Group 1a', color: 'orange' },
    { id: 'group-2', title: 'Group 2', color: 'amber' },
  ]);

  // remove
  act(() => result.current.remove('group-1'));
  expect(result.current.groups).toEqual([{ id: 'group-2', title: 'Group 2', color: 'amber' }]);
});
