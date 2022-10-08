import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Routine } from 'types/routine';

type RoutinesState = {
  routines: Routine[];
  routine: Routine | null;
  setRoutine: (routine: Routine | null) => void;

  isSaveOpen: boolean;
  showSave: (routine?: Routine | null) => void;

  isDuplicateOpen: boolean;
  showDuplicate: (routine: Routine) => void;

  isSaveItemsOpen: boolean;
  showSaveItems: (routine: Routine) => void;

  hide: () => void;
  resetAfterHide: () => void;

  add: (routine: Omit<Routine, 'id' | 'itemIds' | 'minimized'> & { itemIds?: string[] }) => void;
  edit: (id: string, routine: Partial<Omit<Routine, 'id'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<RoutinesState>()(
  persist(
    (set, get) => ({
      routines: [],
      routine: null,
      setRoutine: (routine) => set({ routine }),

      isSaveOpen: false,
      showSave: (routine = null) => set((state) => ({ routine: routine || state.routine, isSaveOpen: true })),

      isDuplicateOpen: false,
      showDuplicate: (routine) => set({ routine, isDuplicateOpen: true }),

      isSaveItemsOpen: false,
      showSaveItems: (routine) => set({ routine, isSaveItemsOpen: true }),

      hide: () => set({ isSaveOpen: false, isSaveItemsOpen: false, isDuplicateOpen: false }),
      resetAfterHide: () => {
        if (get().isSaveOpen || get().isDuplicateOpen) return;
        set({ routine: null });
      },

      add: (routine) => {
        set((state) => ({
          routines: [...state.routines, { id: nanoid(), minimized: false, ...routine, itemIds: routine.itemIds || [] }],
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
  setRoutine: () => {},

  isSaveOpen: false,
  showSave: () => {},

  isDuplicateOpen: false,
  showDuplicate: () => {},

  isSaveItemsOpen: false,
  showSaveItems: () => {},

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
