import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Item } from 'types/item';

type ItemsState = {
  items: Item[];
  add: (groupId: string, item: Omit<Item, 'id' | 'groupId'>) => void;
  edit: (id: string, item: Partial<Omit<Item, 'id'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<ItemsState>()(
  persist(
    (set) => ({
      items: [],
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
    { name: 'items' },
  ),
);

/* c8 ignore start */
const dummy = {
  items: [],
  add: () => {},
  edit: () => {},
  remove: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useItemsStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
