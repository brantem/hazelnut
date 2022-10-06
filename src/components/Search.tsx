import { HTMLAttributes } from 'react';

import Input from 'components/Input';

import { useSearchStore } from 'lib/stores';

type SearchProps = React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  searchKey: string;
};

const Search = ({ searchKey, ...props }: SearchProps) => {
  const { search, setSearch } = useSearchStore(searchKey);

  return (
    <div {...props} data-testid="search">
      <Input name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
    </div>
  );
};

export default Search;
