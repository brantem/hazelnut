import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Group } from 'types/group';
import storage, { getZustandStorage } from 'lib/stores/storage';

type GroupsState = {
  groups: Group[];
  group: Group | null;
  setGroup: (group: Group | null) => void;

  add: (data: Omit<Group, 'id' | 'minimized' | 'createdAt'>) => void;
  edit: (id: string, data: Partial<Omit<Group, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: [],
      group: null,
      setGroup: (group) => set({ group }),

      add: async (data) => {
        const group = { id: nanoid(), minimized: false, createdAt: Date.now(), ...data };
        set((state) => ({ groups: [...state.groups, group] }));
        await storage.add('groups', group);
      },
      edit: async (id, data) => {
        const groups = get().groups.slice();
        const index = groups.findIndex((group) => group.id === id);
        if (index === -1) return;
        groups[index] = { ...groups[index], ...data };
        set({ groups });
        await storage.put('groups', groups[index]);
      },
      remove: async (id) => {
        set((state) => ({ groups: state.groups.filter((group) => group.id !== id) }));
        await storage.delete('groups', id);
      },
    }),
    {
      name: 'groups',
      partialize: (state) => ({ groups: state.groups }),
      getStorage: () => getZustandStorage('groups'),
    },
  ),
);

/* c8 ignore start */
const dummy = {
  groups: [],
  group: null,
  setGroup: () => {},

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
/* c8 ignore stop */
