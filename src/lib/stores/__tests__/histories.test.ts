import dayjs from 'dayjs';
import pick from 'just-pick';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRoutinesStore, useItemsStore, useHistoriesStore, HistoriesState, _migrateRoutinesV0ToV1 } from 'lib/stores';
import { HistoryV0 } from 'types/history';
import { Routine } from 'types/routine';
import { Item } from 'types/item';

const routineId = 'routine-1';
const itemId = 'item-1';
const date = dayjs().startOf('day').toISOString();

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  itemIds: ['item-1', 'item-2'],
  time: null,
  days: ['MONDAY'],
  minimized: false,
};
const simpleRoutine = pick(routine, ['id', 'title', 'color', 'time']);

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
};
const simpleItem = pick(item, ['id', 'title']);

beforeAll(() => {
  const items = renderHook(() => useItemsStore());
  act(() => {
    items.result.current.add('group-1', pick(item, ['id', 'title']));
    items.result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
    items.result.current.add('group-1', { id: 'item-3', title: 'Item 3' } as Item);
  });

  const routines = renderHook(() => useRoutinesStore());
  act(() => routines.result.current.add(pick(routine, ['id', 'title', 'color', 'days', 'time', 'itemIds'])));
});

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
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.selectedDate).toBeNull();
    const date = dayjs().toISOString();
    act(() => result.current.setSelectedDate(date));
    expect(result.current.selectedDate).toEqual(date);
  });

  it('should be able to add and remove item', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const routines = renderHook(() => useRoutinesStore());

    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.histories).toEqual([]);

    // check
    act(() => result.current.save(routine, item, true));
    expect(result.current.histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
      },
    ]);

    // check new item
    act(() => {
      routines.result.current.edit(routine.id, { itemIds: ['item-1', 'item-2', 'item-3'] });
      result.current.save(routine, { ...item, id: 'item-3', title: 'Item 3' }, false);
    });
    expect(result.current.histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
          { id: 'item-3', title: 'Item 3', completedAt: Date.now() },
        ],
      },
    ]);

    // uncheck
    act(() => result.current.save(routine, item, false));
    expect(result.current.histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: null },
          { id: 'item-2', title: 'Item 2', completedAt: null },
          { id: 'item-3', title: 'Item 3', completedAt: Date.now() },
        ],
      },
    ]);

    // reset
    act(() => {
      result.current.save(routine, item, true);
      routines.result.current.edit(routine.id, { itemIds: ['item-1', 'item-2'] });
    });
  });

  it('should be able to add and remove item from past routine', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => result.current.setSelectedDate(_date));
    expect(result.current.histories).toEqual([]);

    // check
    act(() => result.current.save(routine, item, true));
    expect(result.current.histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
      },
    ]);

    // uncheck
    act(() => result.current.save(routine, item, false));
    expect(result.current.histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem, completedAt: null },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
      },
    ]);

    // reset
    act(() => result.current.remove(routineId, _date));
  });

  it('should be able to check whether an item has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    expect(result.current.getIsDone(routineId, itemId)).toBeFalsy();
    act(() => result.current.save(routine, item, true));
    expect(result.current.getIsDone(routineId, itemId)).toBeTruthy();
  });

  it('should be able to check whether an item from past routine has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => result.current.setSelectedDate(_date));
    expect(result.current.getIsDone(routineId, itemId)).toBeFalsy();
    act(() => result.current.save(routine, item, true));
    expect(result.current.getIsDone(routineId, itemId)).toBeTruthy();
    act(() => result.current.remove(routineId, _date)); // reset
  });

  it('should be able to remove history', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const { result } = renderHook(() => useHistoriesStore());
    act(() => {
      result.current.save(routine, item, true);
      result.current.save({ ...routine, id: 'routine-2', title: 'Routine-2' }, item, true);
    });

    expect(result.current.histories).toHaveLength(2);
    act(() => result.current.remove(routineId, dayjs().startOf('day').toISOString()));
    expect(result.current.histories).toHaveLength(1);
  });
});

describe('migrateV0ToV1', async () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should run migrate from version 0 to version 1', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const date = dayjs().startOf('day').toISOString();
    const state = {
      histories: [
        {
          routineId: 'routine-1',
          date,
          items: [{ itemId: 'item-1', date }],
        },
        {
          routineId: 'routine-2',
          date,
          items: [],
        },
      ],
      selectedDate: null,
    } as { histories: HistoryV0[] } & Pick<HistoriesState, 'selectedDate'>;
    expect(_migrateRoutinesV0ToV1(state)).toEqual({
      histories: [
        {
          ...simpleRoutine,
          date,
          items: [
            { ...simpleItem, completedAt: new Date(date).getTime() },
            { id: 'item-2', title: 'Item 2', completedAt: null },
          ],
        },
      ],
      selectedDate: null,
    } as Pick<HistoriesState, 'histories' | 'selectedDate'>);
  });
});
