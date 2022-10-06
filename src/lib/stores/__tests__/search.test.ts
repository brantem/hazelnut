import { renderHook, act } from '@testing-library/react';

import { useSearchStore } from 'lib/stores';

test('useSearchStore', () => {
  const { result } = renderHook(() => useSearchStore('a'));
  act(() => result.current.setSearch('b'));
  expect(result.current.search).toEqual('b');
});
