import dayjs from 'dayjs';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useHistoriesStore } from 'lib/stores';

const routineId = 'routine-1';
const itemId = 'item-1';
const date = dayjs().startOf('day').toISOString();

describe('useHistoriesStore', async () => {
  it('should be able to add and remove item', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.histories).toEqual([]);
    act(() => result.current.save(routineId, itemId, true));
    expect(result.current.histories).toEqual([
      { routineId, date, items: [{ itemId, date: new Date().toISOString() }] },
    ]);
    act(() => result.current.save(routineId, itemId, false));
    expect(result.current.histories).toEqual([{ routineId, date, items: [] }]);
  });

  it('should be able to check whether an item has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.getIsDone(routineId, itemId)).toBeFalsy();
    act(() => result.current.save(routineId, itemId, true));
    expect(result.current.getIsDone(routineId, itemId)).toBeTruthy();
  });
});
