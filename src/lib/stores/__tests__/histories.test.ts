import dayjs from 'dayjs';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useHistoriesStore } from 'lib/stores';

const routineId = 'routine-1';
const itemId = 'item-1';
const date = dayjs().startOf('day').toISOString();

describe('useHistoriesStore', async () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    const { result } = renderHook(() => useHistoriesStore());
    act(() => {
      result.current.setSelectedDate(null);
      result.current.remove(routineId, date);
    });
  });

  it('should be able to set selected date', () => {
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.selectedDate).toBeNull();
    const date = dayjs().toISOString();
    act(() => result.current.setSelectedDate(date));
    expect(result.current.selectedDate).toEqual(date);
  });

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
    act(() => result.current.save(routineId, itemId, true));
  });

  it('should be able to add and remove item from past routine', () => {
    const { result } = renderHook(() => useHistoriesStore());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => result.current.setSelectedDate(_date));
    expect(result.current.histories).toEqual([]);
    act(() => result.current.save(routineId, itemId, true));
    expect(result.current.histories).toEqual([
      { routineId, date: _date, items: [{ itemId, date: new Date().toISOString() }] },
    ]);
    act(() => result.current.save(routineId, itemId, false));
    expect(result.current.histories).toEqual([{ routineId, date: _date, items: [] }]);
    act(() => result.current.remove(routineId, _date)); // reset
  });

  it('should be able to check whether an item has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.getIsDone(routineId, itemId)).toBeFalsy();
    act(() => result.current.save(routineId, itemId, true));
    expect(result.current.getIsDone(routineId, itemId)).toBeTruthy();
  });

  it('should be able to check whether an item from past routine has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => result.current.setSelectedDate(_date));
    expect(result.current.getIsDone(routineId, itemId)).toBeFalsy();
    act(() => result.current.save(routineId, itemId, true));
    expect(result.current.getIsDone(routineId, itemId)).toBeTruthy();
    act(() => result.current.remove(routineId, _date)); // reset
  });

  it('should be able to remove history', () => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => {
      result.current.save(routineId, itemId, true);
      result.current.save('routine-2', itemId, true);
    });

    expect(result.current.histories).toHaveLength(2);
    act(() => result.current.remove(routineId, dayjs().startOf('day').toISOString()));
    expect(result.current.histories).toHaveLength(1);
  });
});
