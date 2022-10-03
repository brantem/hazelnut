import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Group } from 'types/group';

type GroupsState = {
  groups: Group[];
  add: (group: Omit<Group, 'id' | 'items'>) => void;
  edit: (id: string, group: Partial<Omit<Group, 'id' | 'items'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<GroupsState>()(
  persist(
    (set) => ({
      groups: [],
      add: (group) => {
        set((state) => ({ groups: [...state.groups, { id: nanoid(), items: [], ...group }] }));
      },
      edit: (id, group) => {
        set((state) => ({
          groups: state.groups.map((_group) => (_group.id === id ? { ..._group, ...group } : _group)),
        }));
      },
      remove: (id) => {
        set((state) => ({ groups: state.groups.filter((group) => group.id !== id) }));
      },
    }),
    { name: 'groups' },
  ),
);

const dummy = {
  groups: [],
  add: () => {},
  edit: () => {},
  remove: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useGroupsStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
