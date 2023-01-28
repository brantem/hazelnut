import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Layout from 'components/Layout';
import Search from 'components/Search';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import SaveItemModal from 'components/Item/SaveItemModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';
import ItemSettingsModal from 'components/Item/ItemSettingsModal';
import EmptySection from 'components/sections/EmptySection';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { isMatch } from 'lib/helpers';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const Items: NextPage = () => {
  const { groups, clearGroup, isReady } = useGroupsStore((state) => ({
    groups: state.groups,
    clearGroup: () => state.group && state.setGroup(null),
    isReady: state.isReady,
  }));
  const saveGroupModal = useModal(constants.modals.saveGroup);

  const search = useSearch(constants.searches.items);
  const isSearchGroupEmpty = useGroupsStore(
    useCallback(
      (state) => {
        if (!search.value) return false;
        return state.groups.findIndex((group) => isMatch(group.title, search.value)) === -1;
      },
      [search.value],
    ),
  );
  const isSearchItemsEmpty = useItemsStore(
    useCallback(
      (state) => {
        if (!search.value) return false;
        return state.items.findIndex((item) => isMatch(item.title, search.value)) === -1;
      },
      [search.value],
    ),
  );

  const [isSearching, toggleIsSearching] = useReducer((prev) => !prev, search.value !== '');

  return (
    <>
      <Layout
        header={{
          actions: [
            {
              children: <MagnifyingGlassIcon className="h-5 w-5" />,
              className: clsx('!px-1.5', isSearching && 'bg-neutral-100'),
              onClick: () => {
                if (isSearching) search.change('');
                toggleIsSearching();
              },
              testId: 'items-search',
              skip: groups.length === 0,
            },
            {
              children: 'Add Group',
              onClick: () => {
                clearGroup();
                saveGroupModal.show();
              },
            },
          ],
        }}
      >
        {groups.length > 0 ? (
          <>
            {isSearching && (
              <Search
                placeholder="Search for groups or items by title"
                searchKey={constants.searches.items}
                className="sticky top-0 bg-white px-4 pt-1 pb-3 dark:bg-neutral-900"
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
          </>
        ) : (
          isReady && (
            <EmptySection
              title="You have not created any groups yet"
              action={{
                children: 'Add Group',
                onClick: saveGroupModal.show,
              }}
            />
          )
        )}
      </Layout>

      <SaveGroupModal />

      <SaveItemModal />

      <GroupSettingsModal />
      <ItemSettingsModal />
    </>
  );
};

export default Items;
