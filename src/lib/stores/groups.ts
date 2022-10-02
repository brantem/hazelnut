import create from 'zustand';
import { nanoid } from 'nanoid';

import { Group } from 'types/group';

type GroupsState = {
  groups: Group[];
  add: (group: Omit<Group, 'id' | 'items'>) => void;
  edit: (id: string, group: Partial<Omit<Group, 'id' | 'items'>>) => void;
  remove: (id: string) => void;
};

export const useGroupsStore = create<GroupsState>()((set) => ({
  groups: [
    {
      id: 'group-1',
      title: 'Activities',
      items: ['Climbing', 'Cleaning', 'Cooking'],
      color: 'red',
    },
    {
      id: 'group-2',
      title: 'Sunscreen',
      items: ['Chemical', 'Physical'],
      color: 'amber',
    },
  ],
  add: (group) => {
    set((state) => ({
      groups: [...state.groups, { id: nanoid(), items: [], ...group }],
    }));
  },
  edit: (id, group) => {
    set((state) => ({
      groups: state.groups.map((_group) => (_group.id === id ? { ..._group, ...group } : _group)),
    }));
  },
  remove: (id) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    }));
  },
}));
