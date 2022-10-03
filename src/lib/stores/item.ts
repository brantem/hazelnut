import create from 'zustand';

type ItemState = {
  groupId: string | null;
  clear: () => void;

  isAddOpen: boolean;
  showAdd: (groupId: string) => void;

  hide: () => void;
};

export const useItemStore = create<ItemState>()((set) => ({
  groupId: null,
  clear: () => set({ groupId: null }),

  isAddOpen: false,
  showAdd: (groupId) => set({ groupId, isAddOpen: true }),

  hide: () => set({ isAddOpen: false }),
}));
