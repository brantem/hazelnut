import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import dayjs from 'dayjs';
import { StoreValue } from 'idb';
import { nanoid } from 'nanoid';

import { History, HistoryItem } from 'types/history';
import { routinesStore, itemsStore } from 'lib/stores';
import { Schema } from 'types/storage';
import storage from 'lib/stores/storage';
import { pick } from 'lib/helpers';

export type HistoriesState = {
  histories: History[];
  history: History | null;
  setHistory: (history: History | null) => void;

  selectedMonth: string | undefined; // YYYY-MM
  setSelectedMonth: (selectedMonth: string | undefined) => void;

  selectedDate: string | null | undefined; // YYYY-MM-DDTHH:mm:ss.sssZ
  setSelectedDate: (selectedDate: string | null) => void;

  getItem: (routineId: string, itemId: string, forceToday?: boolean) => HistoryItem | null;
  add: (routineId: string) => void;
  saveItem: (routineId: string, itemId: string, data: { value?: number; done: boolean }, forceToday?: boolean) => void;
  addRawItem: (routineId: string, date: string, item: Omit<HistoryItem, 'id' | 'value' | 'completedAt'>) => void;
  addItems: (routineId: string, date: string, itemIds: string[]) => void;
  removeItems: (routineId: string, date: string, itemIds: string[]) => void;
  saveNote: (routineId: string, date: string, note: string) => void;
  remove: (routineId: string, date: string) => void;
};

export const historiesStore = createStore<HistoriesState>()((set, get) => ({
  histories: [],
  history: null,
  setHistory: (history) => set({ history }),

  selectedMonth: undefined,
  setSelectedMonth: async (selectedMonth) => {
    const from = dayjs(selectedMonth);
    const histories = await getHistories(from.valueOf(), from.add(1, 'month').valueOf());

    let selectedDate;
    if (selectedMonth === dayjs().startOf('month').format('YYYY-MM')) {
      selectedDate = dayjs().startOf('day').toISOString();
    } else {
      const history = histories[histories.length - 1];
      selectedDate = history ? dayjs(history.date).startOf('day').toISOString() : null;
    }
    set({ histories, selectedMonth, selectedDate });
  },

  selectedDate: undefined,
  setSelectedDate: (selectedDate) => set({ selectedDate }),

  getItem: (routineId, itemId, forceToday) => {
    const _date = (forceToday ? null : get().selectedDate) || dayjs().startOf('day').toISOString();

    const history = get().histories.find((history) => history.id === routineId && history.date === _date);
    if (!history) return null;

    return history.items.find((item) => item.id === itemId) || null;
  },
  add: async (routineId) => {
    const routine = routinesStore.getState().routines.find((routine) => routine.id === routineId);
    if (!routine) return;

    const _items = itemsStore.getState().items;
    const history = {
      ...pick(routine, ['id', 'title', 'color', 'time']),
      date: get().selectedDate || dayjs().startOf('day').toISOString(),
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
  saveItem: async (routineId, itemId, data, forceToday) => {
    const routine = routinesStore.getState().routines.find((routine) => routine.id === routineId);
    if (!routine) return;

    const date = (forceToday ? null : get().selectedDate) || dayjs().startOf('day').toISOString();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);
    if (index === -1) {
      const _items = itemsStore.getState().items;
      const history = {
        ...pick(routine, ['id', 'title', 'color', 'time']),
        date,
        items: routine.itemIds.reduce((items, id) => {
          const _item = _items.find((item) => item.id === id);
          if (!_item) return items;

          return [
            ...items,
            Object.assign(
              {
                ...pick(_item, ['id', 'type', 'title', 'settings']),
                completedAt: id === itemId ? Date.now() : null,
              },
              id === itemId && 'value' in data && { value: data.value },
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

      const item = histories[index].items.find((item) => item.id === itemId);
      if (!item) {
        const _item = itemsStore.getState().items.find((_item) => _item.id === itemId);
        if (!_item) return;

        histories[index].items.push(
          Object.assign(
            {
              ...pick(_item, ['id', 'type', 'title', 'settings']),
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
  addItems: async (routineId, date, itemIds) => {
    const histories = get().histories.slice();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);

    const items = itemsStore.getState().items;
    for (const itemId of itemIds) {
      const item = items.find((item) => item.id === itemId);
      if (!item) continue;
      histories[index].items.push({ ...pick(item, ['id', 'type', 'title', 'settings']), completedAt: null });
    }

    set({ histories });
    await storage.put('histories', histories[index]);
  },
  removeItems: async (routineId, date, itemIds) => {
    const histories = get().histories.slice();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);

    histories[index].items = histories[index].items.filter((item) => !itemIds.includes(item.id));

    set({ histories });
    await storage.put('histories', histories[index]);
  },
  saveNote: async (routineId, date, note) => {
    const histories = get().histories.slice();
    const index = get().histories.findIndex((history) => history.id === routineId && history.date === date);

    histories[index].note = note;

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

export function useHistoriesStore(): HistoriesState;
export function useHistoriesStore<T>(selector: (state: HistoriesState) => T, equals?: (a: T, b: T) => boolean): T;
export function useHistoriesStore(selector?: any, equals?: any) {
  return useStore(historiesStore, selector, equals);
}

/* c8 ignore start */
export const getHistories = async (from: number, to: number) => {
  const index = await storage.index('histories', 'createdAt');
  if (!index) return [];
  let cursor = await index.openCursor(IDBKeyRange.bound(from, to));
  const histories: StoreValue<Schema, 'histories'>[] = [];
  while (cursor) {
    histories.push(cursor.value);
    cursor = await cursor.continue();
  }
  return histories.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
/* c8 ignore stop */
