import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Item } from 'types/item';

export type ItemsState = {
  items: Item[];
  item: Item | null;
  setItem: (item: Item | null) => void;

  getItemsByGroupId: (groupId: string) => Item[];
  getItemIdsByIds: (itemIds: string[]) => string[];
  getItemsByIds: (itemIds: string[]) => Item[];

  add: (groupId: string, item: Omit<Item, 'id' | 'groupId'>) => void;
  edit: (id: string, item: Partial<Omit<Item, 'id' | 'groupId'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: [],
      item: null,
      setItem: (item) => set({ item }),

      getItemsByGroupId: (groupId) => get().items.filter((item) => item.groupId === groupId),
      getItemIdsByIds: (itemIds) => {
        const items = get().items;
        return itemIds.reduce((prev, itemId) => {
          const item = items.find((item) => item.id === itemId);
          return item ? [...prev, item.id] : prev;
        }, [] as string[]);
      },
      getItemsByIds: (itemIds) => {
        const items = get().items;
        return itemIds.reduce((prev, itemId) => {
          const item = items.find((item) => item.id === itemId);
          return item ? [...prev, item] : prev;
        }, [] as Item[]);
      },

      add: (groupId, item) => {
        set((state) => ({ items: [...state.items, { id: nanoid(), groupId, ...item }] }));
      },
      edit: (id, item) => {
        set((state) => ({ items: state.items.map((_item) => (_item.id === id ? { ..._item, ...item } : _item)) }));
      },
      remove: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },
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
  item: null,
  setItem: () => {},

  getItemsByGroupId: () => [],
  getItemIdsByIds: () => [],
  getItemsByIds: () => [],

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
