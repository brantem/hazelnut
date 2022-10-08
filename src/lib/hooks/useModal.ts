import { useModalStore } from 'lib/stores';

export const useModal = (id: string) => {
  const isOpen = useModalStore((state) => state.ids.includes(id));
  const show = useModalStore((state) => state.show.bind(null, id));
  const hide = useModalStore((state) => state.hide);
  return { isOpen, show, hide };
};
