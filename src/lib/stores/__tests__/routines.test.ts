import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
  minimized: false,
};

describe('useRoutinesStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open add modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.showSave());
    expect(result.current.routine).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.showSave(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('should show save items modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.showSaveItems(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSaveItemsOpen).toEqual(true);
  });

  it('should show settings modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.showSettings(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSettingsOpen).toEqual(true);
  });

  it('should show duplicate modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.showDuplicate(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isDuplicateOpen).toEqual(true);
  });

  it('should hide and reset', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.showSave(routine);
      result.current.showSaveItems(routine);
      result.current.showSettings(routine);
      result.current.showDuplicate(routine);
    });
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSaveOpen).toEqual(true);
    expect(result.current.isSaveItemsOpen).toEqual(true);
    expect(result.current.isSettingsOpen).toEqual(true);
    expect(result.current.isDuplicateOpen).toEqual(true);
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
    expect(result.current.routine).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(false);
    expect(result.current.isSaveItemsOpen).toEqual(false);
    expect(result.current.isSettingsOpen).toEqual(false);
    expect(result.current.isDuplicateOpen).toEqual(false);
  });

  it('should not reset if isSaveOpen or isDuplicateOpen is true', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.showSave(routine);
      result.current.resetAfterHide();
    });
    expect(result.current.routine).toEqual(routine);

    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
      result.current.showDuplicate(routine);
      result.current.resetAfterHide();
    });
    expect(result.current.routine).toEqual(routine);
  });

  it('should add routine', () => {
    const { result } = renderHook(() => useRoutinesStore());
    expect(result.current.routines).toHaveLength(0);
    act(() => {
      result.current.add({ id: 'routine-1', title: 'Routine 1', color: 'red' } as Routine);
      result.current.add({ id: 'routine-2', title: 'Routine 2', color: 'amber' } as Routine);
    });
    expect(result.current.routines).toHaveLength(2);
    expect(result.current.routines).toEqual([
      { id: 'routine-1', title: 'Routine 1', color: 'red', itemIds: [], minimized: false },
      { id: 'routine-2', title: 'Routine 2', color: 'amber', itemIds: [], minimized: false },
    ]);
  });

  it('should edit routine', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() =>
      result.current.edit('routine-1', { title: 'Routine 1a', color: 'orange', itemIds: ['item-1'], minimized: true }),
    );
    expect(result.current.routines).toEqual([
      { id: 'routine-1', title: 'Routine 1a', color: 'orange', itemIds: ['item-1'], minimized: true },
      { id: 'routine-2', title: 'Routine 2', color: 'amber', itemIds: [], minimized: false },
    ]);
  });

  it('should remove routine', () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.remove('routine-1'));
    expect(result.current.routines).toEqual([
      { id: 'routine-2', title: 'Routine 2', color: 'amber', itemIds: [], minimized: false },
    ]);
  });
});
