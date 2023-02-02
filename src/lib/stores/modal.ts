import { create } from 'zustand';

type ModalState = {
  ids: string[];
  show: (id: string) => void;
  hide: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  ids: [],
  show: (id) => set((state) => ({ ids: [...state.ids, id] })),
  hide: () => set({ ids: [] }),
}));
