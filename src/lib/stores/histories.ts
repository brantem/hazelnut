import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import dayjs from 'dayjs';
import pick from 'just-pick';

import { History, HistoryItem } from 'types/history';
import { Routine } from 'types/routine';
import { itemsStore } from 'lib/stores';
import storage from 'lib/stores/storage';

export type HistoriesState = {
  histories: History[];
  selectedDate: string | null | undefined;
  setSelectedDate: (selectedDate: string | null) => void;

  getIsDone: (routineId: string, itemId: string, forceToday?: boolean) => boolean;
  save: (
    routine: Omit<History, 'date' | 'items'> & { itemIds?: Routine['itemIds'] },
    item: Omit<HistoryItem, 'completedAt'>,
    done: boolean,
  ) => void;
  remove: (routineId: string, date: string) => void;
};

export const historiesStore = createVanilla<HistoriesState>()((set, get) => ({
  histories: [],
  selectedDate: undefined,
  setSelectedDate: (selectedDate) => {
    set({ selectedDate });
    if (selectedDate) {
      localStorage.setItem('historySelectedDate', selectedDate);
    } else {
      localStorage.removeItem('historySelectedDate');
    }
  },

  getIsDone: (routineId, itemId, forceToday) => {
    const _date = (forceToday ? null : get().selectedDate) || dayjs().startOf('day').toISOString();
    const history = get().histories.find((history) => history.id === routineId && history.date === _date);
    if (!history) return false;
    return !!history.items.find((item) => item.id === itemId)?.completedAt;
  },
  save: async (routine, item, done) => {
    const date = get().selectedDate || dayjs().startOf('day').toISOString();

    const index = get().histories.findIndex((history) => history.id === routine.id && history.date === date);
    if (index === -1) {
      const _items = itemsStore.getState().items;
      const history = {
        ...pick(routine, ['id', 'title', 'color', 'time']),
        date,
        items: _items.reduce((items, _item) => {
          if (!routine.itemIds?.includes(_item.id)) return items;
          return [
            ...items,
            {
              ...pick(_item, ['id', 'title']),
              completedAt: _item.id === item.id ? Date.now() : null,
            },
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
        histories[index].items.push({
          ...pick(item, ['id', 'title']),
          completedAt: Date.now(),
        });
      } else {
        histories[index].items = histories[index].items.map((_item) => {
          if (_item.id !== item.id) return _item;
          return { ..._item, ...pick(item, ['id', 'title']), completedAt: done ? Date.now() : null };
        });
      }
      set({ histories });
      await storage.put('histories', histories[index]);
    }
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
