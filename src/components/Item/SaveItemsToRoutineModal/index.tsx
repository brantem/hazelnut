import { useCallback, useEffect, useState } from 'react';

import BottomSheet from 'components/BottomSheet';
import Search from 'components/Search';
import Group from 'components/Item/SaveItemsToRoutineModal/Group';

import { useRoutinesStore, useGroupsStore, useItemsStore, useSearchStore } from 'lib/stores';
import { isMatch } from 'lib/helpers';

export const SEARCH_KEY = 'save-items-routine-modal';

const SaveItemsToRoutineModal = () => {
  const { routine, isSaveItemsOpen, hide, resetAfterHide, edit } = useRoutinesStore();
  const { groups } = useGroupsStore();
  const { search, setSearch } = useSearchStore(SEARCH_KEY);
  const getItemIdsByIds = useItemsStore((state) => state.getItemIdsByIds);
  const isSearchEmpty = useItemsStore(
    useCallback((state) => state && state.items.findIndex((item) => isMatch(item.title, search)) === -1, [search]),
  );

  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!routine) return;
    setItemIds(routine.itemIds);
  }, [routine, itemIds]);

  return (
    <BottomSheet
      isOpen={isSaveItemsOpen}
      onClose={hide}
      title={
        <>
          Items <span className="ml-1 text-base font-normal text-neutral-500">{itemIds.length}</span>
        </>
      }
      data-testid="save-items-to-routine-modal"
      afterLeave={() => {
        resetAfterHide();
        setSearch('');
      }}
    >
      <ol className="max-h-[75vh] flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {groups.map((group) => (
          <Group
            key={group.id}
            group={group}
            itemIds={itemIds}
            onItemClick={(isChecked, itemId) => {
              if (isChecked) {
                setItemIds((prev) => [...prev, itemId]);
              } else {
                setItemIds((prev) => prev.filter((id) => id !== itemId));
              }
            }}
          />
        ))}

        {isSearchEmpty && <li className="text-neutral-500">No results found</li>}
      </ol>

      <div className="bg-neutral-50 px-4 py-3">
        <Search placeholder="Search for item titles" searchKey={SEARCH_KEY} />

        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
          onClick={() => {
            edit(routine!.id, { itemIds: getItemIdsByIds(itemIds) });
            hide();
          }}
        >
          Save
        </button>
      </div>
    </BottomSheet>
  );
};

export default SaveItemsToRoutineModal;
