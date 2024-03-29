import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { nanoid } from 'nanoid';

import { Routine } from 'types/routine';
import storage from 'lib/stores/storage';

type RoutinesState = {
  routines: Routine[];
  routine: Routine | null;
  setRoutine: (routine: Routine | null) => void;

  add: (data: Omit<Routine, 'id' | 'itemIds' | 'minimized' | 'createdAt'> & { itemIds?: string[] }) => void;
  edit: (id: string, data: Partial<Omit<Routine, 'id' | 'createdAt'>>) => void;
  remove: (id: string) => void;

  isReady: boolean;
};

export const routinesStore = createStore<RoutinesState>()((set, get) => ({
  routines: [],
  routine: null,
  setRoutine: (routine) => set({ routine }),

  add: async (data) => {
    const routine = { id: nanoid(), minimized: false, createdAt: Date.now(), ...data, itemIds: data.itemIds || [] };
    set((state) => ({ routines: [...state.routines, routine] }));
    await storage.add('routines', routine);
  },
  edit: async (id, data) => {
    const routines = get().routines.slice();
    const index = routines.findIndex((routine) => routine.id === id);
    if (index === -1) return;
    routines[index] = { ...routines[index], ...data };
    set({ routines });
    await storage.put('routines', routines[index]);
  },
  remove: async (id) => {
    set((state) => ({ routines: state.routines.filter((routine) => routine.id !== id) }));
    await storage.delete('routines', id);
  },

  isReady: false,
}));

export function useRoutinesStore(): RoutinesState;
export function useRoutinesStore<T>(selector: (state: RoutinesState) => T, equals?: (a: T, b: T) => boolean): T;
export function useRoutinesStore(selector?: any, equals?: any) {
  return useStore(routinesStore, selector, equals);
}
