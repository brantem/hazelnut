import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { nanoid } from 'nanoid';

import { Item } from 'types/item';
import storage from 'lib/stores/storage';

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

  isReady: boolean;
};

export const itemsStore = createStore<ItemsState>()((set, get) => ({
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
    const item = { id: nanoid(), groupId, createdAt: Date.now(), ...data } as Item;
    set((state) => ({ items: [...state.items, item] }));
    await storage.add('items', item);
  },
  edit: async (id, data) => {
    const items = get().items.slice();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;
    items[index] = { ...items[index], ...data } as Item;
    set({ items });
    await storage.put('items', items[index]);
  },
  remove: async (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    await storage.delete('items', id);
  },

  isReady: false,
}));

export function useItemsStore(): ItemsState;
export function useItemsStore<T>(selector: (state: ItemsState) => T, equals?: (a: T, b: T) => boolean): T;
export function useItemsStore(selector?: any, equals?: any) {
  return useStore(itemsStore, selector, equals);
}
