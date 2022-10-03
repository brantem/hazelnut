import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupStore } from 'lib/stores';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
};

describe('useGroupStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useGroupStore());
    act(() => {
      result.current.hide();
      result.current.clear();
    });
  });

  it('open add modal', () => {
    const { result } = renderHook(() => useGroupStore());
    act(() => result.current.showSave());
    expect(result.current.group).toEqual(null);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('open edit modal', () => {
    const { result } = renderHook(() => useGroupStore());
    act(() => result.current.showSave(group));
    expect(result.current.group).toEqual(group);
    expect(result.current.isSaveOpen).toEqual(true);
  });

  it('show settings', () => {
    const { result } = renderHook(() => useGroupStore());
    act(() => result.current.showSettings(group));
    expect(result.current.group).toEqual(group);
    expect(result.current.isSettingsOpen).toEqual(true);
  });
});
