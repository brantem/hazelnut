import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Group, GroupItem } from 'types/group';

type GroupsState = {
  groups: Group[];
  add: (group: Omit<Group, 'id' | 'items'>) => void;
  addItem: (id: string, item: Omit<GroupItem, 'id'>) => void;
  edit: (id: string, group: Partial<Omit<Group, 'id' | 'items'>>) => void;
  remove: (id: string) => void;
  removeItem: (id: string, itemId: string) => void;
};

const useStore = create<GroupsState>()(
  persist(
    (set) => ({
      groups: [],
      add: (group) => {
        set((state) => ({ groups: [...state.groups, { id: nanoid(), items: [], ...group }] }));
      },
      addItem: (id, item) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, items: [...group.items, { id: nanoid(), ...item }] } : group,
          ),
        }));
      },
      edit: (id, group) => {
        set((state) => ({
          groups: state.groups.map((_group) => (_group.id === id ? { ..._group, ...group } : _group)),
        }));
      },
      remove: (id) => {
        set((state) => ({ groups: state.groups.filter((group) => group.id !== id) }));
      },
      removeItem: (id, itemId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, items: group.items.filter((item) => item.id !== itemId) } : group,
          ),
        }));
      },
    }),
    { name: 'groups' },
  ),
);

/* c8 ignore start */
const dummy = {
  groups: [],
  add: () => {},
  addItem: () => {},
  edit: () => {},
  remove: () => {},
  removeItem: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useGroupsStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
