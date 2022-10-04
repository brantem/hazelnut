import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutineStore } from 'lib/stores';
import { Routine } from 'types/routine';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
};

describe('useRoutineStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useRoutineStore());
    act(() => {
      result.current.hide();
      result.current.clear();
    });
  });

  it('open add modal', () => {
    const { result } = renderHook(() => useRoutineStore());
    act(() => result.current.showSave());
    expect(result.current.routine).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('open edit modal', () => {
    const { result } = renderHook(() => useRoutineStore());
    act(() => result.current.showSave(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('show save items modal', () => {
    const { result } = renderHook(() => useRoutineStore());
    act(() => result.current.showSaveItems(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSaveItemsOpen).toEqual(true);
  });

  it('show settings', () => {
    const { result } = renderHook(() => useRoutineStore());
    act(() => result.current.showSettings(routine));
    expect(result.current.routine).toEqual(routine);
    expect(result.current.isSettingsOpen).toEqual(true);
  });
});
