import { useCallback, useEffect, useState } from 'react';

import BottomSheet from 'components/BottomSheet';
import Search from 'components/Search';
import Group from 'components/Item/SaveItemsToRoutineModal/Group';

import { useRoutinesStore, useGroupsStore, useItemsStore } from 'lib/stores';
import { isMatch } from 'lib/helpers';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const SaveItemsToRoutineModal = () => {
  const { routine, edit } = useRoutinesStore((state) => ({ routine: state.routine, edit: state.edit }));
  const groups = useGroupsStore((state) => state.groups);
  const modal = useModal(constants.modals.saveItemsToRoutine);

  const getItemIdsByIds = useItemsStore((state) => state.getItemIdsByIds);
  const search = useSearch('save-items-routine-modal');
  const isSearchEmpty = useItemsStore(
    useCallback(
      (state) => state && state.items.findIndex((item) => isMatch(item.title, search.value)) === -1,
      [search.value],
    ),
  );

  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!routine) return;
    search.change('');
    setItemIds(routine.itemIds);
  }, [routine]);

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      title={
        <>
          Items <span className="ml-1 text-base font-normal text-neutral-500">{itemIds.length}</span>
        </>
      }
      data-testid="save-items-to-routine-modal"
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
        <Search placeholder="Search for item titles" searchKey={'save-items-routine-modal'} />

        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
          onClick={() => {
            edit(routine!.id, { itemIds: getItemIdsByIds(itemIds) });
            modal.hide();
          }}
        >
          Save
        </button>
      </div>
    </BottomSheet>
  );
};

export default SaveItemsToRoutineModal;
