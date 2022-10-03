import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useItemStore } from 'lib/stores';

describe('useItemStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useItemStore());
    result.current.hide();
  });

  it('open add modal', () => {
    const { result } = renderHook(() => useItemStore());
    act(() => result.current.showAdd('group-1'));
    expect(result.current.groupId).toEqual('group-1');
    expect(result.current.isAddOpen).toEqual(true);
  });
});
