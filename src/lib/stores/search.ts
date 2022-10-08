import create from 'zustand';

type SearchState = {
  search: { [key: string]: string };
  setSearch: (key: string, value: string) => void;
};

const useStore = create<SearchState>()((set) => ({
  search: {},
  setSearch: (key, value) => set((prev) => ({ search: { ...prev.search, [key]: value } })),
}));

export const useSearchStore = (key: string) => {
  const search = useStore((state) => state.search[key] || '');
  const setSearch = useStore((state) => state.setSearch.bind(null, key));
  return { search, setSearch };
};
