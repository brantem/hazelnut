import dayjs from 'dayjs';
import { act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { routinesStore, itemsStore, historiesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item, ItemType } from 'types/item';
import { omit } from 'lib/helpers';
import colors from 'data/colors';

vi.mock('lib/stores/storage', () => ({
  default: {
    add: () => {},
    get: () => {},
    index: vi.fn().mockImplementation(() => ({
      openCursor: vi.fn().mockImplementation(() => ({
        value: null,
        continue: vi.fn(),
      })),
    })),
    getAll: () => {},
    put: () => {},
    delete: () => {},
  },
}));

// @ts-expect-error mock
window.IDBKeyRange = { bound: vi.fn() };

const date = dayjs().startOf('day').toISOString();

const generateRoutine = (i: number, data?: Partial<Omit<Routine, 'id' | 'title' | 'color'>>) => {
  const routine = {
    id: `routine-${i}`,
    title: `Routine ${i}`,
    color: colors[(i - 1) % colors.length],
    time: null,
    recurrence: {
      startAt: 0,
      interval: 1,
      frequency: 'DAILY',
      days: [],
    },
    itemIds: [],
    ...(data || {}),
  } as Routine;
  return routine;
};

const itemIds = ['item-2', 'item-1'];
const routine = generateRoutine(1, { itemIds });
const simpleRoutine = omit(routine, ['itemIds', 'recurrence']);

const generateItem = (i: number, data?: Partial<Omit<Item, 'id' | 'title'>>) => {
  const item = { id: 'item-' + i, title: 'Item ' + i, ...(data || {}) } as Item;

  if (data?.type === ItemType.Number && !item.settings) item.settings = { minCompleted: 1, step: 1 };

  return item;
};

const item = generateItem(1);
const simpleItem = generateItem(1);
const item2 = generateItem(2);
const simpleItem2 = generateItem(2);
const item3 = generateItem(3, { type: ItemType.Number });
const simpleItem3 = generateItem(3, { type: ItemType.Number });

// TODO: for some reason use*Store is not working

describe('historiesStore', async () => {
  beforeAll(() => {
    act(() => {
      itemsStore.getState().add('group-1', generateItem(1));
      itemsStore.getState().add('group-1', generateItem(2));
      itemsStore.getState().add('group-1', generateItem(3, { type: ItemType.Number }));
    });

    act(() => routinesStore.getState().add(routine));
  });

  afterEach(() => {
    act(() => historiesStore.setState({ histories: [], selectedDate: null }));
  });

  it('should set history', async () => {
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

  it('should be able to set selected month', async () => {
    const date = dayjs().format('YYYY-MM');
    act(() => historiesStore.setState({ selectedDate: date }));

    act(() => historiesStore.getState().setSelectedMonth(date));
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(historiesStore.getState().selectedDate).toBeNull();
    expect(historiesStore.getState().selectedMonth).toEqual(date);

    act(() => historiesStore.getState().setSelectedMonth(undefined));
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(historiesStore.getState().selectedMonth).toBeUndefined();
  });

  it('should be able to set selected date', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const date = dayjs().toISOString();
    act(() => historiesStore.getState().setSelectedDate(date));
    expect(historiesStore.getState().selectedDate).toEqual(date);
    act(() => historiesStore.getState().setSelectedDate(null));
    expect(historiesStore.getState().selectedDate).toBeNull();
  });

  it('should be able to add new history', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    act(() => historiesStore.getState().setSelectedDate(date));

    act(() => historiesStore.getState().add({ ...routine, itemIds: [...routine.itemIds, 'item-4'] }));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date: date.valueOf(),
        items: [
          { ...simpleItem2, completedAt: null },
          { ...simpleItem, completedAt: null },
        ],
        createdAt: Date.now(),
      },
    ]);
  });

  it('should be able to complete and incomplete an item', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());

    const _routine = generateRoutine(1, { itemIds: [...itemIds, 'item-3'] });

    // complete
    const __routine = generateRoutine(1, { itemIds: [...itemIds, 'item-4'] });
    act(() => historiesStore.getState().save(__routine, item, { done: true }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem2, completedAt: null },
          { ...simpleItem, completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // complete new item
    act(() => historiesStore.getState().save(_routine, item3, { value: 1, done: true }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem2, completedAt: null },
          { ...simpleItem, completedAt: Date.now() },
          { ...simpleItem3, value: 1, completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // complete existing item
    act(() => historiesStore.getState().save(_routine, item2, { done: true }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem2, completedAt: Date.now() },
          { ...simpleItem, completedAt: Date.now() },
          { ...simpleItem3, value: 1, completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // incomplete
    act(() => historiesStore.getState().save(_routine, item, { done: false }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [
          { ...simpleItem2, completedAt: Date.now() },
          { ...simpleItem, completedAt: null },
          { ...simpleItem3, value: 1, completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);
  });

  it('should be able to complete and incomplete an item with value', async () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());

    const _routine = generateRoutine(1, { itemIds: ['item-3'] });

    // complete
    act(() => historiesStore.getState().save(_routine, item3, { value: 1, done: true }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [{ ...simpleItem3, value: 1, completedAt: Date.now() }],
        createdAt: Date.now(),
      },
    ]);

    // incomplete
    act(() => historiesStore.getState().save(_routine, item3, { value: 0, done: false }, true));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date,
        items: [{ ...simpleItem3, value: 0, completedAt: null }],
        createdAt: Date.now(),
      },
    ]);
  });

  it('should be able to complete and incomplete an item from past routine', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => historiesStore.getState().setSelectedDate(_date));

    // complete
    act(() => historiesStore.getState().save(routine, item, { done: true }));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem2, completedAt: null },
          { ...simpleItem, completedAt: Date.now() },
        ],
        createdAt: Date.now(),
      },
    ]);

    // incomplete
    act(() => historiesStore.getState().save(routine, item, { done: false }));
    expect(historiesStore.getState().histories).toEqual([
      {
        ...simpleRoutine,
        date: _date,
        items: [
          { ...simpleItem2, completedAt: null },
          { ...simpleItem, completedAt: null },
        ],
        createdAt: Date.now(),
      },
    ]);

    // reset
    act(() => historiesStore.getState().remove(routine.id, _date));
  });

  it('should be able to check whether an item has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    expect(historiesStore.getState().getItem(routine.id, item.id)).toBeNull();
    act(() => historiesStore.getState().save(routine, item, { done: true }));
    expect(historiesStore.getState().getItem(routine.id, item.id)).not.toBeNull();
  });

  it('should be able to check whether an item from past routine has been completed or not', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    const _date = dayjs().subtract(5, 'day').toISOString();
    act(() => historiesStore.getState().setSelectedDate(_date));
    expect(historiesStore.getState().getItem(routine.id, item.id)).toBeNull();
    act(() => historiesStore.getState().save(routine, item, { done: true }));
    expect(historiesStore.getState().getItem(routine.id, item.id)).not.toBeNull();
    act(() => historiesStore.getState().remove(routine.id, _date)); // reset
  });

  it('should be able to add new items to history', () => {
    act(() => historiesStore.getState().save(routine, item, { done: true }));
    const item3 = { id: 'item-3', title: 'Item 3', completedAt: null };
    expect(historiesStore.getState().histories[0].items).not.toContainEqual(item3);
    act(() => historiesStore.getState().addItems(routine.id, dayjs().startOf('day').toISOString(), [item3]));
    expect(historiesStore.getState().histories[0].items).toContainEqual(item3);
  });

  it('should be able to remove history', () => {
    vi.setSystemTime(dayjs().startOf('hour').toDate());
    act(() => {
      historiesStore.getState().save(routine, item, { done: true });
      historiesStore.getState().save(generateRoutine(2), item, { done: true });
    });

    expect(historiesStore.getState().histories).toHaveLength(2);
    act(() => historiesStore.getState().remove(routine.id, dayjs().startOf('day').toISOString()));
    expect(historiesStore.getState().histories).toHaveLength(1);
  });

  it('should not update completedAt', async () => {
    vi.useRealTimers();
    act(() => historiesStore.setState({ selectedDate: null }));

    const _routine = generateRoutine(1, { itemIds: ['item-3'] });
    act(() => historiesStore.getState().save(_routine, item3, { value: 1, done: true }));
    const prevCompletedAt = historiesStore.getState().histories[0].items[0].completedAt;
    await waitFor(() => new Promise((res) => setTimeout(res, 100)));
    act(() => historiesStore.getState().save(_routine, item3, { value: 2, done: true }));
    expect(historiesStore.getState().histories[0].items[0].completedAt).toEqual(prevCompletedAt);
  });
});
