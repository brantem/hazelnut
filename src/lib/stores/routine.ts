import create from 'zustand';

import { Routine } from 'types/routine';

type RoutineState = {
  routine: Routine | null;
  clear: () => void;

  isSaveOpen: boolean;
  showSave: (routine?: Routine | null) => void;

  isSettingsOpen: boolean;
  showSettings: (routine: Routine) => void;

  hide: () => void;
};

export const useRoutineStore = create<RoutineState>()((set) => ({
  routine: null,
  clear: () => set({ routine: null }),

  isSaveOpen: false,
  showSave: (routine = null) => set((state) => ({ routine: routine || state.routine, isSaveOpen: true })),

  isSettingsOpen: false,
  showSettings: (routine) => set({ routine, isSettingsOpen: true }),

  hide: () => set({ isSaveOpen: false, isSettingsOpen: false }),
}));