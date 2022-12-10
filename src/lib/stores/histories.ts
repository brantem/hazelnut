import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import dayjs from 'dayjs';
import { StoreValue } from 'idb';
import { nanoid } from 'nanoid';

import { History, HistoryItem } from 'types/history';
import { Routine } from 'types/routine';
import { itemsStore } from 'lib/stores';
import { Schema } from 'types/storage';
import storage from 'lib/stores/storage';
import { pick } from 'lib/helpers';

export type HistoriesState = {
  histories: History[];
  history: History | null;
  setHistory: (history: History | null) => void;

  selectedMonth: string | undefined; // YYYY-MM
  setSelectedMonth: (selectedMonth: string | undefined) => void;

  selectedDate: string | null | undefined; // YYYY-MM-DD
  setSelectedDate: (selectedDate: string | null) => void;

  getItem: (routineId: string, itemId: string, forceToday?: boolean) => HistoryItem | null;
  add: (routine: Omit<History, 'date' | 'items'> & Pick<Routine, 'itemIds'>) => void;
  saveItem: (
    routine: Omit<History, 'date' | 'items'> & { itemIds?: Routine['itemIds'] },
    item: Omit<HistoryItem, 'completedAt'>,
    data: { value?: number; done: boolean },
    forceToday?: boolean,
  ) => void;
  addRawItem: (routineId: string, date: string, item: Omit<HistoryItem, 'id' | 'value' | 'completedAt'>) => void;
  addItems: (routineId: string, date: string, items: Omit<HistoryItem, 'completedAt'>[]) => void;
  remove: (routineId: string, date: string) => void;
};

export const historiesStore = createVanilla<HistoriesState>()((set, get) => ({
  histories: [],
  history: null,
  setHistory: (history) => set({ history }),

  selectedMonth: undefined,
  setSelectedMonth: async (selectedMonth) => {
    const from = dayjs(selectedMonth);
    const histories = await getHistories(from.valueOf(), from.add(1, 'month').valueOf());
    set({ histories, selectedMonth, selectedDate: null });
    localStorage.removeItem('history-selected-date');
  },

  selectedDate: undefined,
  setSelectedDate: (selectedDate) => {
    set({ selectedDate });
    if (selectedDate) {
      localStorage.setItem('history-selected-date', selectedDate);
    } else {
      localStorage.removeItem('history-selected-date');
    }
  },

  getItem: (routineId, itemId, forceToday) => {
    const _date = (forceToday ? null : get().selectedDate) || dayjs().startOf('day').toISOString();
    const history = get().histories.find((history) => history.id === routineId && history.date === _date);
    return history?.items.find((item) => item.id === itemId) || null;
  },
  add: async (routine) => {
    const date = get().selectedDate || dayjs().startOf('day').toISOString();
    const _items = itemsStore.getState().items;
    const history = {
      ...pick(routine, ['id', 'title', 'color', 'time']),
      date,
      items: routine.itemIds.reduce((items, itemId) => {
        const _item = _items.find((item) => item.id === itemId);
        if (!_item) return items;
        return [
          ...items,
          {
            ...pick(_item, ['id', 'type', 'title', 'settings']),
            completedAt: null,
          },
        ];
      }, [] as History['items']),
      createdAt: Date.now(),
    };

    set((state) => ({ histories: [...state.histories, history] }));
    await storage.add('histories', history);
  },
  saveItem: async (routine, item, data, forceToday) => {
    const date = (forceToday ? null : get().selectedDate) || dayjs().startOf('day').toISOString();
    const index = get().histories.findIndex((history) => history.id === routine.id && history.date === date);
    if (index === -1) {
      const _items = itemsStore.getState().items;
      const history = {
        ...pick(routine, ['id', 'title', 'color', 'time']),
        date,
        items: routine.itemIds!.reduce((items, itemId) => {
          const _item = _items.find((item) => item.id === itemId);
          if (!_item) return items;
          return [
            ...items,
            Object.assign(
              {
                ...pick(_item.id === item.id ? item : _item, ['id', 'type', 'title', 'settings']),
                completedAt: _item.id === item.id ? Date.now() : null,
              },
              _item.id === item.id && 'value' in data && { value: data.value },
            ),
          ];
        }, [] as History['items']),
        createdAt: Date.now(),
      };

      set((state) => ({ histories: [...state.histories, history] }));
      await storage.add('histories', history);
    } else {
      const histories = get().histories.slice();
      histories[index] = { ...histories[index], ...pick(routine, ['id', 'title', 'color', 'time']) };

      const itemIndex = histories[index].items.findIndex((_item) => _item.id === item.id);
      if (itemIndex === -1) {
        histories[index].items.push(
          Object.assign(
            {
              ...pick(item, ['id', 'type', 'title', 'settings']),
              completedAt: Date.now(),
            },
            'value' in data && { value: data.value },
          ),
        );
      } else {
        histories[index].items = histories[index].items.map((_item) => {
          if (_item.id !== item.id) return _item;
          return Object.assign(
            {
              ..._item,
              ...pick(item, ['id', 'type', 'title', 'settings']),
              completedAt: data.done ? _item.completedAt || Date.now() : null,
            },
            'value' in data && { value: data.value },
          );
        });
      }

      set({ histories });
      await storage.put('histories', histories[index]);
    }
  },
  addRawItem: async (routineId, date, item) => {
    const histories = get().histories.slice();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);

    histories[index].items.push({ id: nanoid(), ...item, completedAt: null });

    set({ histories });
    await storage.put('histories', histories[index]);
  },
  addItems: async (routineId, date, items) => {
    const histories = get().histories.slice();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);

    for (const item of items) {
      histories[index].items.push({ ...pick(item, ['id', 'type', 'title', 'settings']), completedAt: null });
    }

    set({ histories });
    await storage.put('histories', histories[index]);
  },
  remove: async (routineId, date) => {
    set({
      histories: get().histories.filter((history) => {
        if (history.id === routineId && history.date === date) return false;
        return true;
      }),
    });

    await storage.delete('histories', [routineId, date]);
  },
}));

export const useHistoriesStore = create(historiesStore);

/* c8 ignore start */
export const getHistories = async (from: number, to: number) => {
  const index = await storage.index('histories', 'createdAt')!;
  let cursor = await index.openCursor(IDBKeyRange.bound(from, to));
  const values: StoreValue<Schema, 'histories'>[] = [];
  while (cursor) {
    values.push(cursor.value);
    cursor = await cursor.continue();
  }
  return values;
};
/* c8 ignore stop */
