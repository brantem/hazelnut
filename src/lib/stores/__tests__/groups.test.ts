import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
};

describe('useGroupsStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open add modal', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.showSave());
    expect(result.current.group).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('should open add item modal', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.showAddItem(group));
    expect(result.current.group).toEqual(group);
    expect(result.current.isAddItemOpen).toEqual(true);
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.showSave(group));
    expect(result.current.group).toEqual(group);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('should hide and reset', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => {
      result.current.showSave(group);
      result.current.showAddItem(group);
    });
    expect(result.current.group).toEqual(group);
    expect(result.current.isSaveOpen).toEqual(true);
    expect(result.current.isAddItemOpen).toEqual(true);

    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
    expect(result.current.group).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(false);
    expect(result.current.isAddItemOpen).toEqual(false);
  });

  it('should not reset if isSaveOpen is true', () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => {
      result.current.showSave(group);
      result.current.resetAfterHide();
    });
    expect(result.current.group).toEqual(group);
  });

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
