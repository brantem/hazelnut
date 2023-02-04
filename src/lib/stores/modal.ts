import { create } from 'zustand';

type ModalState = {
  id: string | null;
  show: (id: string | null) => void;
  hide: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  id: null,
  show: (id) => set({ id }),
  hide: () => set({ id: null }),
}));
