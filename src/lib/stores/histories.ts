import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import dayjs from 'dayjs';

import { History, HistoryItem } from 'types/history';
import { Routine } from 'types/routine';
import { itemsStore } from 'lib/stores';
import storage from 'lib/stores/storage';
import { pick } from 'lib/helpers';

export type HistoriesState = {
  histories: History[];
  history: History | null;
  setHistory: (history: History | null) => void;

  selectedDate: string | null | undefined;
  setSelectedDate: (selectedDate: string | null) => void;

  getItem: (routineId: string, itemId: string, forceToday?: boolean) => HistoryItem | null;
  add: (routine: Omit<History, 'date' | 'items'> & Pick<Routine, 'itemIds'>) => void;
  save: (
    routine: Omit<History, 'date' | 'items'> & { itemIds?: Routine['itemIds'] },
    item: Omit<HistoryItem, 'completedAt'>,
    data: { value?: number; done: boolean },
    forceToday?: boolean,
  ) => void;
  addItems: (routineId: string, date: string, items: Omit<HistoryItem, 'completedAt'>[]) => void;
  remove: (routineId: string, date: string) => void;
};

export const historiesStore = createVanilla<HistoriesState>()((set, get) => ({
  histories: [],
  history: null,
  setHistory: (history) => set({ history }),

  selectedDate: undefined,
  setSelectedDate: (selectedDate) => set({ selectedDate }),

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
  save: async (routine, item, data, forceToday) => {
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
              completedAt: data.done ? Date.now() : null,
            },
            'value' in data && { value: data.value },
          );
        });
      }

      set({ histories });
      await storage.put('histories', histories[index]);
    }
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
