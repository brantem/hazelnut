import { useModalStore } from 'lib/stores';

export const useModal = (id: string) => {
  return useModalStore((state) => ({
    isOpen: state.id === id,
    show: () => state.show(id),
    hide: state.hide,
  }));
};
