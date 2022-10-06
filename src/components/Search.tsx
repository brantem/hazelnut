import { HTMLAttributes } from 'react';

import Input from 'components/Input';

import { useSearchStore } from 'lib/stores';

type SearchProps = React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  searchKey: string;
  placeholder?: string;
};

const Search = ({ searchKey, placeholder = 'Search', ...props }: SearchProps) => {
  const { search, setSearch } = useSearchStore(searchKey);

  return (
    <div {...props} data-testid="search">
      <Input
        name="search"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
    </div>
  );
};

export default Search;
