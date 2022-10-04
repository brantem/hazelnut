import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';

test('useRoutinesStore', () => {
  const { result } = renderHook(() => useRoutinesStore());

  // add
  expect(result.current.routines).toHaveLength(0);
  act(() => {
    result.current.add({ id: 'routine-1', title: 'Routine 1', color: 'red' } as Routine);
    result.current.add({ id: 'routine-2', title: 'Routine 2', color: 'amber' } as Routine);
  });
  expect(result.current.routines).toHaveLength(2);
  expect(result.current.routines).toEqual([
    { id: 'routine-1', title: 'Routine 1', color: 'red' },
    { id: 'routine-2', title: 'Routine 2', color: 'amber' },
  ]);

  // edit
  act(() => result.current.edit('routine-1', { title: 'Routine 1a', color: 'orange' }));
  expect(result.current.routines).toEqual([
    { id: 'routine-1', title: 'Routine 1a', color: 'orange' },
    { id: 'routine-2', title: 'Routine 2', color: 'amber' },
  ]);

  // remove
  act(() => result.current.remove('routine-1'));
  expect(result.current.routines).toEqual([{ id: 'routine-2', title: 'Routine 2', color: 'amber' }]);
});
