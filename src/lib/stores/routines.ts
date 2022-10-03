import { useState, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { Routine } from 'types/routine';

type RoutinesState = {
  routines: Routine[];
  add: (routine: Omit<Routine, 'id'>) => void;
  edit: (id: string, routine: Partial<Omit<Routine, 'id'>>) => void;
  remove: (id: string) => void;
};

const useStore = create<RoutinesState>()(
  persist(
    (set) => ({
      routines: [],
      add: (routine) => {
        set((state) => ({ routines: [...state.routines, { id: nanoid(), ...routine }] }));
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
    { name: 'routines' },
  ),
);

/* c8 ignore start */
const dummy = {
  routines: [],
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
