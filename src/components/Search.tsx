import Input, { InputProps } from 'components/Input';

import { useSearch } from 'lib/hooks';

type SearchProps = InputProps & {
  searchKey: string;
  placeholder?: string;
};

const Search = ({ searchKey, placeholder = 'Search', ...props }: SearchProps) => {
  const search = useSearch(searchKey);

  return (
    <Input
      {...props}
      name="search"
      placeholder={placeholder}
      value={search.value}
      onChange={(e) => search.change(e.target.value.trim())}
      autoFocus
      data-testid="search"
    />
  );
};

export default Search;
