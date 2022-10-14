import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import pick from 'just-pick';

import { HistoryV0, History, HistoryItem } from 'types/history';
import { Routine } from 'types/routine';
import { itemsStore, routinesStore } from 'lib/stores';

export type HistoriesState = {
  histories: History[];
  selectedDate: string | null;
  setSelectedDate: (selectedDate: string | null) => void;

  getIsDone: (routineId: string, itemId: string) => boolean;
  save: (
    routine: Omit<History, 'date' | 'items'> & { itemIds?: Routine['itemIds'] },
    item: Omit<HistoryItem, 'completedAt'>,
    done: boolean,
  ) => void;
  remove: (routineId: string, date: string) => void;

  hasHydrated: boolean;
};

const useStore = create<HistoriesState>()(
  persist(
    (set, get) => ({
      histories: [],
      selectedDate: null,
      setSelectedDate: (selectedDate) => set({ selectedDate }),

      getIsDone: (routineId, itemId) => {
        const date = get().selectedDate || dayjs().startOf('day').toISOString();
        const history = get().histories.find((history) => history.id === routineId && history.date === date);
        if (!history) return false;
        return !!history.items.find((item) => item.id === itemId)?.completedAt;
      },
      save: (routine, item, done) => {
        const date = get().selectedDate || dayjs().startOf('day').toISOString();

        const index = get().histories.findIndex((history) => {
          return history.id === routine.id && history.date === date;
        });
        if (index === -1) {
          const _items = itemsStore.getState().items;
          set((state) => ({
            histories: [
              ...state.histories,
              {
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
              },
            ],
          }));
        } else {
          const histories = get().histories.slice();
          const itemIndex = histories[index].items.findIndex((_item) => _item.id === item.id);
          if (itemIndex === -1) {
            histories[index].items.push({
              ...pick(item, ['id', 'title']),
              completedAt: Date.now(),
            });
          } else {
            histories[index].items = histories[index].items.map((_item) => {
              if (_item.id !== item.id) return _item;
              return { ..._item, completedAt: done ? Date.now() : null };
            });
          }
          set({ histories });
        }
      },
      remove: (routineId, date) => {
        set({
          histories: get().histories.filter((history) => {
            if (history.id === routineId && history.date === date) return false;
            return true;
          }),
        });
      },

      hasHydrated: true,
    }),
    {
      name: 'histories',
      partialize: (state) => ({
        histories: state.histories,
        selectedDate: state.selectedDate,
      }),
      version: 1,
      /* c8 ignore start */
      migrate: (persistedState: any, version) => {
        if (version === 0) return _migrateRoutinesV0ToV1(persistedState);
        return persistedState;
      },
      /* c8 ignore stop */
    },
  ),
);

export const _migrateRoutinesV0ToV1 = (state: { histories: HistoryV0[] } & Pick<HistoriesState, 'selectedDate'>) => {
  const _routines = routinesStore.getState().routines;
  const _items = itemsStore.getState().items;
  return {
    histories: state.histories.reduce((histories, history) => {
      const routine = _routines.find((routine) => routine.id === history.routineId);
      if (!routine) return histories;
      const items = _items.filter((item) => routine.itemIds.includes(item.id));
      return [
        ...histories,
        {
          ...pick(routine, ['id', 'title', 'color', 'time']),
          date: history.date,
          items: items.reduce((items, item) => {
            const oldItem = history.items.find((oldItem) => oldItem.itemId === item.id);
            if (!oldItem) return [...items, { ...pick(item, ['id', 'title']), completedAt: null }];
            return [...items, { ...pick(item, ['id', 'title']), completedAt: new Date(oldItem.date).getTime() }];
          }, [] as History['items']),
        },
      ];
    }, [] as History[]),
    selectedDate: state.selectedDate,
  };
};

/* c8 ignore start */
const dummy = {
  histories: [],
  selectedDate: null,
  setSelectedDate: () => {},

  getIsDone: () => false,
  save: () => {},
  remove: () => {},

  hasHydrated: false,
};

// https://github.com/pmndrs/zustand/issues/1145
export const useHistoriesStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
