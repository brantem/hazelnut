import create from 'zustand';

type ModalState = {
  ids: string[];
  show: (id: string) => void;
  hide: () => void;
};

export const _useModalStore = create<ModalState>()((set) => ({
  ids: [],
  show: (id) => set((state) => ({ ids: [...state.ids, id] })),
  hide: () => set({ ids: [] }),
}));

export const useModalStore = (id: string) => {
  const isOpen = _useModalStore((state) => state.ids.includes(id));
  const show = _useModalStore((state) => state.show.bind(null, id));
  const hide = _useModalStore((state) => state.hide);
  return { isOpen, show, hide };
};
