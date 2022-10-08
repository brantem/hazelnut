import { renderHook, act } from '@testing-library/react';

import { useModal } from 'lib/hooks';

test('useModalStore', () => {
  const { result } = renderHook(() => useModal('a'));
  expect(result.current.isOpen).toBeFalsy();
  act(() => result.current.show());
  expect(result.current.isOpen).toBeTruthy();
  act(() => result.current.hide());
  expect(result.current.isOpen).toBeFalsy();
});
