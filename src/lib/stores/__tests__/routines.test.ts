import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutinesStore } from 'lib/stores';
import storage from 'lib/stores/storage';
import days from 'data/days';
import colors from 'data/colors';

const generateRoutine = (i: number, full = true) => {
  const routine: any = {
    id: 'routine-' + i,
    title: 'Routine ' + i,
    color: colors[i - 1],
    days,
    time: null,
    minimized: false,
    createdAt: 0,
  };
  if (full) routine.itemIds = [];
  return routine;
};

describe('useRoutinesStore', () => {
  it('should set routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    await act(() => result.current.setRoutine(generateRoutine(1)));
    expect(result.current.routine).toEqual(generateRoutine(1));
    await act(() => result.current.setRoutine(null));
    expect(result.current.routine).toBeNull();
  });

  it('should add routine', async () => {
    const add = vi.spyOn(storage, 'add');

    const { result } = renderHook(() => useRoutinesStore());
    expect(result.current.routines).toHaveLength(0);
    await act(() => {
      result.current.add(generateRoutine(1, false));
      result.current.add(generateRoutine(2, false));
    });
    expect(result.current.routines).toHaveLength(2);
    expect(result.current.routines).toEqual([generateRoutine(1), generateRoutine(2)]);
    expect(add).toHaveBeenCalledWith('routines', generateRoutine(1));
    expect(add).toHaveBeenCalledWith('routines', generateRoutine(2));
  });

  it(`should cancel when trying to update routine that doesn't exist`, async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useRoutinesStore());
    const values = { title: 'Routine 1a', color: 'orange', itemIds: ['item-1'], minimized: true };
    await act(() => result.current.edit('routine-1a', values));
    expect(result.current.routines).toEqual([generateRoutine(1), generateRoutine(2)]);
    expect(put).not.toHaveBeenCalled();
  });

  it('should edit routine', async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useRoutinesStore());
    const values = { title: 'Routine 1a', color: 'orange', itemIds: ['item-1'], minimized: true };
    await act(() => result.current.edit('routine-1', values));
    expect(result.current.routines).toEqual([{ ...generateRoutine(1), ...values }, generateRoutine(2)]);
    expect(put).toHaveBeenCalledWith('routines', { ...generateRoutine(1), ...values });
  });

  it('should remove routine', async () => {
    const _delete = vi.spyOn(storage, 'delete');

    const { result } = renderHook(() => useRoutinesStore());
    await act(() => result.current.remove('routine-1'));
    expect(result.current.routines).toEqual([generateRoutine(2)]);
    expect(_delete).toHaveBeenCalledWith('routines', 'routine-1');
  });
});
