import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import Search from 'components/Search';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import AddItemToGroupModal from 'components/Item/AddItemToGroupModal';
import EditItemModal from 'components/Item/EditItemModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';
import ItemSettingsModal from 'components/Item/ItemSettingsModal';

import { useGroupsStore, useItemsStore, useSearchStore } from 'lib/stores';
import { isMatch } from 'lib/helpers';

const Items: NextPage = () => {
  const { groups, showSave } = useGroupsStore((state) => ({ groups: state.groups, showSave: state.showSave }));
  const { search, setSearch } = useSearchStore('items');
  const isSearchGroupEmpty = useGroupsStore(
    useCallback(
      (state) => {
        if (!search) return false;
        return state.groups.findIndex((group) => isMatch(group.title, search)) === -1;
      },
      [search],
    ),
  );
  const isSearchItemsEmpty = useItemsStore(
    useCallback(
      (state) => {
        if (!search) return false;
        return state.items.findIndex((item) => isMatch(item.title, search)) === -1;
      },
      [search],
    ),
  );

  const [isSearching, toggleIsSearching] = useReducer((prev) => !prev, false);

  return (
    <>
      <Layout
        header={{
          actions: [
            {
              text: <MagnifyingGlassIcon className="h-5 w-5" />,
              className: '!px-1.5',
              onClick: () => {
                if (isSearching) setSearch('');
                toggleIsSearching();
              },
              testId: 'items-search',
            },
            { text: 'Add Group', onClick: () => showSave() },
          ],
        }}
      >
        {isSearching && (
          <Search
            placeholder="Search for group or item titles"
            searchKey="items"
            className="sticky top-0 bg-white px-4 pt-1 pb-3"
          />
        )}

        <section className="space-y-3">
          {groups.map((group, i) => (
            <GroupCard key={i} group={group} />
          ))}

          {isSearchGroupEmpty && isSearchItemsEmpty && (
            <p className="mx-4 mt-3 text-center text-neutral-500">No results found</p>
          )}
        </section>
      </Layout>

      <SaveGroupModal />

      <AddItemToGroupModal />
      <EditItemModal />

      <GroupSettingsModal />
      <ItemSettingsModal />
    </>
  );
};

export default Items;
