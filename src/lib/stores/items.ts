import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Item } from 'types/item';

type ItemsState = {
  items: Item[];
  groupId: string | null;

  isAddOpen: boolean;
  showAdd: (groupId: string) => void;

  hide: () => void;
  resetAfterHide: () => void;

  add: (groupId: string, item: Omit<Item, 'id' | 'groupId'>) => void;
  edit: (id: string, item: Partial<Omit<Item, 'id'>>) => void;
  remove: (id: string) => void;

  search: string;
  setSearch: (search: string) => void;
};

const useStore = create<ItemsState>()(
  persist(
    (set) => ({
      items: [],
      groupId: null,

      isAddOpen: false,
      showAdd: (groupId) => set({ groupId, isAddOpen: true }),

      hide: () => set({ isAddOpen: false }),
      resetAfterHide: () => set({ groupId: null, search: '' }),

      add: (groupId, item) => {
        set((state) => ({ items: [...state.items, { id: nanoid(), groupId, ...item }] }));
      },
      edit: (id, item) => {
        set((state) => ({ items: state.items.map((_item) => (_item.id === id ? { ..._item, ...item } : _item)) }));
      },
      remove: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      search: '',
      setSearch: (search) => set({ search }),
    }),
    {
      name: 'items',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/* c8 ignore start */
const dummy = {
  items: [],
  groupId: null,

  isAddOpen: false,
  showAdd: () => {},

  hide: () => {},
  resetAfterHide: () => {},

  add: () => {},
  edit: () => {},
  remove: () => {},

  search: '',
  setSearch: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useItemsStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
