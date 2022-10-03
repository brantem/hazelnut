import create from 'zustand';

import { Group } from 'types/group';

type GroupState = {
  group: Group | null;
  clear: () => void;

  isSaveOpen: boolean;
  showSave: (group?: Group | null) => void;

  isSettingsOpen: boolean;
  showSettings: (group: Group) => void;

  hide: () => void;
};

export const useGroupStore = create<GroupState>()((set) => ({
  group: null,
  clear: () => set({ group: null }),

  isSaveOpen: false,
  showSave: (group = null) => set((state) => ({ group: group || state.group, isSaveOpen: true })),

  isSettingsOpen: false,
  showSettings: (group) => set({ group, isSettingsOpen: true }),

  hide: () => set({ isSaveOpen: false, isSettingsOpen: false }),
}));
