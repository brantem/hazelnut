import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { nanoid } from 'nanoid';

import { Group } from 'types/group';
import storage from 'lib/stores/storage';

type GroupsState = {
  groups: Group[];
  group: Group | null;
  setGroup: (group: Group | null) => void;

  add: (data: Omit<Group, 'id' | 'minimized' | 'createdAt'>) => void;
  edit: (id: string, data: Partial<Omit<Group, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;

  isReady: boolean;
};

export const groupsStore = createVanilla<GroupsState>()((set, get) => ({
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

  isReady: false,
}));

export const useGroupsStore = create(groupsStore);
