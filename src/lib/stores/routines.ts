import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Routine } from 'types/routine';

type RoutinesState = {
  routines: Routine[];
  routine: Routine | null;

  isSaveOpen: boolean;
  showSave: (routine?: Routine | null) => void;

  isSaveItemsOpen: boolean;
  showSaveItems: (routine: Routine) => void;

  isSettingsOpen: boolean;
  showSettings: (routine: Routine) => void;

  hide: () => void;
  resetAfterHide: () => void;

  add: (routine: Omit<Routine, 'id' | 'itemIds' | 'minimized'>) => void;
  edit: (id: string, routine: Partial<Omit<Routine, 'id'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<RoutinesState>()(
  persist(
    (set) => ({
      routines: [],
      routine: null,

      isSaveOpen: false,
      showSave: (routine = null) => set((state) => ({ routine: routine || state.routine, isSaveOpen: true })),

      isSaveItemsOpen: false,
      showSaveItems: (routine) => set({ routine, isSaveItemsOpen: true }),

      isSettingsOpen: false,
      showSettings: (routine) => set({ routine, isSettingsOpen: true }),

      hide: () => set({ isSaveOpen: false, isSaveItemsOpen: false, isSettingsOpen: false }),
      resetAfterHide: () => set({ routine: null }),

      add: (routine) => {
        set((state) => ({
          routines: [...state.routines, { id: nanoid(), itemIds: [], minimized: false, ...routine }],
        }));
      },
      edit: (id, routine) => {
        set((state) => ({
          routines: state.routines.map((_routine) => (_routine.id === id ? { ..._routine, ...routine } : _routine)),
        }));
      },
      remove: (id) => {
        set((state) => ({ routines: state.routines.filter((routine) => routine.id !== id) }));
      },
    }),
    {
      name: 'routines',
      partialize: (state) => ({ routines: state.routines }),
    },
  ),
);

/* c8 ignore start */
const dummy = {
  routines: [],
  routine: null,

  isSaveOpen: false,
  showSave: () => {},

  isSaveItemsOpen: false,
  showSaveItems: () => {},

  isSettingsOpen: false,
  showSettings: () => {},

  hide: () => {},
  resetAfterHide: () => {},

  add: () => {},
  edit: () => {},
  remove: () => {},
};

// https://github.com/pmndrs/zustand/issues/1145
export const useRoutinesStore = ((selector, equals) => {
  const store = useStore(selector, equals);
  const [isHydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector ? selector(dummy) : dummy;
}) as typeof useStore;
/* c8 ignore stop */
