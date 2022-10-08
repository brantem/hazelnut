import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

describe('useGroupsStore', () => {
  it('should add group', () => {
    const { result } = renderHook(() => useGroupsStore());
    expect(result.current.groups).toHaveLength(0);
    act(() => {
      result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as Group);
      result.current.add({ id: 'group-2', title: 'Group 2', color: 'amber' } as Group);
    });
    expect(result.current.groups).toEqual([
      { id: 'group-1', title: 'Group 1', color: 'red', minimized: false },
      { id: 'group-2', title: 'Group 2', color: 'amber', minimized: false },
    ]);
  });

  it('should edit group', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.edit('group-1', { title: 'Group 1a', color: 'orange', minimized: true }));
    expect(result.current.groups).toEqual([
      { id: 'group-1', title: 'Group 1a', color: 'orange', minimized: true },
      { id: 'group-2', title: 'Group 2', color: 'amber', minimized: false },
    ]);
  });

  it('should remove group', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.remove('group-1'));
    expect(result.current.groups).toEqual([{ id: 'group-2', title: 'Group 2', color: 'amber', minimized: false }]);
  });
});
