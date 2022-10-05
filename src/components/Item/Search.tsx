import { HTMLAttributes } from 'react';

import Input from 'components/Input';

import { useItemsStore } from 'lib/stores';

const Search = ({ ...props }: React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const { search, setSearch } = useItemsStore();

  return (
    <div {...props}>
      <Input name="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
  );
};

export default Search;
