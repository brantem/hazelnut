import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Group } from 'types/group';

type GroupsState = {
  groups: Group[];
  group: Group | null;
  setGroup: (group: Group | null) => void;

  isSaveOpen: boolean;
  showSave: (group?: Group | null) => void;

  hide: () => void;
  resetAfterHide: () => void;

  add: (group: Omit<Group, 'id' | 'minimized'>) => void;
  edit: (id: string, group: Partial<Omit<Group, 'id'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: [],
      group: null,
      setGroup: (group) => set({ group }),

      isSaveOpen: false,
      showSave: (group = null) => set((state) => ({ group: group || state.group, isSaveOpen: true })),

      hide: () => set({ isSaveOpen: false }),
      resetAfterHide: () => {
        if (get().isSaveOpen) return;
        set({ group: null });
      },

      add: (group) => {
        set((state) => ({ groups: [...state.groups, { id: nanoid(), minimized: false, ...group }] }));
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
    {
      name: 'groups',
      partialize: (state) => ({ groups: state.groups }),
    },
  ),
);

/* c8 ignore start */
const dummy = {
  groups: [],
  group: null,
  setGroup: () => {},

  isSaveOpen: false,
  showSave: () => {},

  hide: () => {},
  resetAfterHide: () => {},

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
