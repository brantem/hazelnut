import { create } from 'zustand';

type SearchState = {
  search: { [key: string]: string };
  setSearch: (key: string, value: string) => void;
};

export const useSearchStore = create<SearchState>()((set) => ({
  search: {},
  setSearch: (key, value) => set((prev) => ({ search: { ...prev.search, [key]: value } })),
}));
