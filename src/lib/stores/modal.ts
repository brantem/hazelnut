import create from 'zustand';

type ModalState = {
  openId: string | null;
  show: (id: string) => void;
  hide: () => void;
};

export const _useModalStore = create<ModalState>()((set) => ({
  openId: null,
  show: (openId) => set({ openId }),
  hide: () => set({ openId: null }),
}));

export const useModalStore = (id: string) => {
  const isOpen = _useModalStore((state) => state.openId === id);
  const show = _useModalStore((state) => state.show.bind(null, id));
  const hide = _useModalStore((state) => state.hide);
  return { isOpen, show, hide };
};
