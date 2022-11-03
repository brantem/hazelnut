import { HTMLAttributes } from 'react';

import Input from 'components/Input';

import { useSearch } from 'lib/hooks';

type SearchProps = React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  searchKey: string;
  placeholder?: string;
};

const Search = ({ searchKey, placeholder = 'Search', ...props }: SearchProps) => {
  const search = useSearch(searchKey);

  return (
    <div {...props} data-testid="search">
      <Input
        name="search"
        placeholder={placeholder}
        value={search.value}
        onChange={(e) => search.change(e.target.value.trim())}
        autoFocus
      />
    </div>
  );
};

export default Search;
