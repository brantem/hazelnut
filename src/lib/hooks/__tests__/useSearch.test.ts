import { renderHook, act } from '@testing-library/react';

import { useSearch } from 'lib/hooks';

test('useSearchStore', () => {
  const { result } = renderHook(() => useSearch('a'));
  act(() => result.current.change('b'));
  expect(result.current.value).toEqual('b');
});
