import { useState, useEffect } from 'react';
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Item } from 'types/item';
import storage, { getZustandStorage } from 'lib/stores/storage';

export type ItemsState = {
  items: Item[];
  item: Item | null;
  setItem: (item: Item | null) => void;

  getItemsByGroupId: (groupId: string) => Item[];
  getItemIdsByIds: (itemIds: string[]) => string[];
  getItemsByIds: (itemIds: string[]) => Item[];

  add: (groupId: string, data: Omit<Item, 'id' | 'groupId' | 'createdAt'>) => void;
  edit: (id: string, data: Partial<Omit<Item, 'id' | 'groupId' | 'createdAt'>>) => void;
  remove: (id: string) => void;
};

export const itemsStore = createVanilla<ItemsState>()(
  persist(
    (set, get) => ({
      items: [],
      item: null,
      setItem: (item) => set({ item }),

      // i'm not sure if i have to replace this with storage.getAll or not
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

      add: async (groupId, data) => {
        const item = { id: nanoid(), groupId, createdAt: Date.now(), ...data };
        set((state) => ({ items: [...state.items, item] }));
        await storage.add('items', item);
      },
      edit: async (id, data) => {
        const items = get().items.slice();
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return;
        items[index] = { ...items[index], ...data };
        set({ items });
        await storage.put('items', items[index]);
      },
      remove: async (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
        await storage.delete('items', id);
      },
    }),
    {
      name: 'items',
      partialize: (state) => ({ items: state.items }),
      getStorage: () => getZustandStorage('items'),
    },
  ),
);

const useStore = create(itemsStore);

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
