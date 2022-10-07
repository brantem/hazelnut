import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

import { History } from 'types/history';

export type HistoriesState = {
  histories: History[];
  getIsDone: (routineId: string, itemId: string) => boolean;
  save: (routineId: string, itemId: string, done: boolean) => void;
};

const useStore = create<HistoriesState>()(
  persist(
    (set, get) => ({
      histories: [],
      getIsDone: (routineId, itemId) => {
        const date = dayjs().startOf('day').toISOString();
        const history = get().histories.find((history) => history.routineId === routineId && history.date === date);
        if (!history) return false;
        return history.items.findIndex((item) => item.itemId === itemId) !== -1;
      },
      save: (routineId, itemId, done) => {
        const histories = get().histories.slice();
        const date = dayjs().startOf('day').toISOString();

        const index = histories.findIndex((history) => history.routineId === routineId && history.date === date);
        if (index === -1) {
          set({ histories: [...histories, { routineId, date, items: [{ itemId, date: new Date().toISOString() }] }] });
        } else {
          if (done) {
            histories[index].items.push({ itemId, date: new Date().toISOString() });
          } else {
            histories[index].items = histories[index].items.filter((item) => item.itemId !== itemId);
          }
          set({ histories });
        }
      },
    }),
    {
      name: 'histories',
      partialize: (state) => ({ histories: state.histories }),
    },
  ),
);

/* c8 ignore start */
const dummy = {
  histories: [],
  getIsDone: () => false,
  save: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useHistoriesStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
