import { useSearchStore } from 'lib/stores';

export const useSearch = (key: string) => {
  const value = useSearchStore((state) => state.search[key] || '');
  const change = useSearchStore((state) => state.setSearch.bind(null, key));
  return { value, change };
};
