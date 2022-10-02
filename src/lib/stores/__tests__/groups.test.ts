import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';

test('useGroupsStore', () => {
  const { result } = renderHook(() => useGroupsStore());
  expect(result.current.groups).toHaveLength(0);
  act(() => {
    result.current.add({ title: 'Group 1', color: 'red' });
    result.current.add({ title: 'Group 2', color: 'amber' });
  });
  expect(result.current.groups).toHaveLength(2);
  const id = result.current.groups[0].id;
  expect(result.current.groups[0]).toEqual({ id, title: 'Group 1', color: 'red', items: [] });
  act(() => result.current.edit(id, { title: 'Group 1a', color: 'orange' }));
  expect(result.current.groups[0]).toEqual({ id, title: 'Group 1a', color: 'orange', items: [] });
  act(() => result.current.remove(id));
  expect(result.current.groups).toHaveLength(1);
});
