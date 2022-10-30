import dayjs from 'dayjs';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { routinesStore, itemsStore, historiesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item } from 'types/item';
import { pick } from 'lib/helpers';

const routineId = 'routine-1';
const itemId = 'item-1';
const date = dayjs().startOf('day').toISOString();

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  itemIds: ['item-1', 'item-2'],
  time: null,
  recurrence: {
    startAt: 0,
    interval: 1,
    frequency: 'DAILY',
    days: [],
  },
  minimized: false,
  createdAt: 0,
};
const simpleRoutine = pick(routine, ['id', 'title', 'color', 'time']);

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};
const simpleItem = pick(item, ['id', 'title']);

// TODO: for some reason use*Store is not working

describe('historiesStore', async () => {
  beforeAll(() => {
    act(() => {
      itemsStore.getState().add('group-1', pick(item, ['id', 'title']));
      itemsStore.getState().add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
      itemsStore.getState().add('group-1', { id: 'item-3', title: 'Item 3' } as Item);
    });

    act(() => routinesStore.getState().add(pick(routine, ['id', 'title', 'color', 'recurrence', 'time', 'itemIds'])));
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    act(() => {
      historiesStore.getState().setSelectedDate(null);
      historiesStore.getState().remove(routineId, date);
    });
  });

  it('should set routine', async () => {
    const history = {
      ...simpleRoutine,
      date,
      items: [{ ...simpleItem, completedAt: Date.now() }],
      createdAt: Date.now(),
    };
    await act(() => historiesStore.getState().setHistory(history));
    expect(historiesStore.getState().history).toEqual(history);
    await act(() => historiesStore.getState().setHistory(null));
    expect(historiesStore.getState().history).toBeNull();
  });

  it('should be able to set selected date', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const date = dayjs().toISOString();
    act(() => historiesStore.getState().setSelectedDate(date));
    expect(historiesStore.getState().selectedDate).toEqual(date);
    act(() => historiesStore.getState().setSelectedDate(null));
    expect(historiesStore.getState().selectedDate).toBeNull();
  });

  it('should be able to add and remove item', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());

    expect(historiesStore.getState().histories).toEqual([]);

    // check
    act(() => historiesStore.getState().save(routine, item, true, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
        createdAt: Date.now(),
      },
    ]);

    // check new item
    await act(() => routinesStore.getState().edit(routine.id, { itemIds: ['item-1', 'item-2', 'item-3'] }));
    act(() => historiesStore.getState().save(routine, { ...item, id: 'item-3', title: 'Item 3' }, false, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
          { id: 'item-3', title: 'Item 3', completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // uncheck
    act(() => historiesStore.getState().save(routine, item, false, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem, completedAt: null },
          { id: 'item-2', title: 'Item 2', completedAt: null },
          { id: 'item-3', title: 'Item 3', completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // reset
    await act(async () => {
      await historiesStore.getState().save(routine, item, true);
      await routinesStore.getState().edit(routine.id, { itemIds: ['item-1', 'item-2'] });
    });
  });

  it('should be able to add and remove item from past routine', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => historiesStore.getState().setSelectedDate(_date));
    expect(historiesStore.getState().histories).toEqual([]);

    // check
    act(() => historiesStore.getState().save(routine, item, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem, completedAt: Date.now() },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
        createdAt: Date.now(),
      },
    ]);

    // uncheck
    act(() => historiesStore.getState().save(routine, item, false));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem, completedAt: null },
          { id: 'item-2', title: 'Item 2', completedAt: null },
        ],
        createdAt: Date.now(),
      },
    ]);

    // reset
    act(() => historiesStore.getState().remove(routineId, _date));
  });

  it('should be able to check whether an item has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    expect(historiesStore.getState().getIsDone(routineId, itemId)).toBeFalsy();
    act(() => historiesStore.getState().save(routine, item, true));
    expect(historiesStore.getState().getIsDone(routineId, itemId)).toBeTruthy();
  });

  it('should be able to check whether an item from past routine has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => historiesStore.getState().setSelectedDate(_date));
    expect(historiesStore.getState().getIsDone(routineId, itemId)).toBeFalsy();
    act(() => historiesStore.getState().save(routine, item, true));
    expect(historiesStore.getState().getIsDone(routineId, itemId)).toBeTruthy();
    act(() => historiesStore.getState().remove(routineId, _date)); // reset
  });

  it('should be able to add new items to history', () => {
    act(() => historiesStore.getState().save(routine, item, true));
    const item3 = { id: 'item-3', title: 'Item 3', completedAt: null };
    expect(historiesStore.getState().histories[0].items).not.toContainEqual(item3);
    act(() => historiesStore.getState().addItems(routineId, dayjs().startOf('day').toISOString(), [item3]));
    expect(historiesStore.getState().histories[0].items).toContainEqual(item3);
  });

  it('should be able to remove history', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    act(() => {
      historiesStore.getState().save(routine, item, true);
      historiesStore.getState().save({ ...routine, id: 'routine-2', title: 'Routine-2' }, item, true);
    });

    expect(historiesStore.getState().histories).toHaveLength(2);
    act(() => historiesStore.getState().remove(routineId, dayjs().startOf('day').toISOString()));
    expect(historiesStore.getState().histories).toHaveLength(1);
  });
});
