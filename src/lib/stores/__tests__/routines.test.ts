import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutinesStore } from 'lib/stores';

test('useRoutinesStore', () => {
  const { result } = renderHook(() => useRoutinesStore());

  // add
  expect(result.current.routines).toHaveLength(0);
  act(() => {
    result.current.add({ id: 'routine-1', title: 'Routine 1', color: 'red' } as any);
    result.current.add({ id: 'routine-2', title: 'Routine 2', color: 'amber' } as any);
  });
  expect(result.current.routines).toHaveLength(2);
  expect(result.current.routines).toEqual([
    { id: 'routine-1', title: 'Routine 1', color: 'red' },
    { id: 'routine-2', title: 'Routine 2', color: 'amber' },
  ]);

  // edit
  act(() => result.current.edit('routine-1', { title: 'Routine 1a', color: 'orange' }));
  expect(result.current.routines[0]).toEqual({ id: 'routine-1', title: 'Routine 1a', color: 'orange' });

  // remove
  act(() => result.current.remove(result.current.routines[1].id));
  expect(result.current.routines).toHaveLength(1);
});
