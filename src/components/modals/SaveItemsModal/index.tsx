import { useCallback } from 'react';

import BottomSheet from 'components/BottomSheet';
import Group from 'components/modals/SaveItemsModal/Group';
import Search from 'components/Search';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { isMatch } from 'lib/helpers';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

type SaveItemsModalProps = {
  modalKey: string;
  itemIds: string[];
  disabledItemIds?: string[];
  onChange: (itemIds: string[]) => void;
  onSave: () => void;
};

const SaveItemsModal = ({ modalKey, itemIds, disabledItemIds, onChange, onSave }: SaveItemsModalProps) => {
  const groups = useGroupsStore((state) => state.groups);
  const modal = useModal(modalKey);

  const search = useSearch(constants.searches.saveItems);
  const isSearchEmpty = useItemsStore(
    useCallback(
      (state) => state && state.items.findIndex((item) => isMatch(item.title, search.value)) === -1,
      [search.value],
    ),
  );

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      onAfterClose={() => /* c8 ignore next */ search && search.change('')}
      title={
        <>
          Items <span className="ml-1 text-base font-normal text-neutral-500">{itemIds.length}</span>
        </>
      }
      data-testid="save-items-modal"
    >
      <ol className="max-h-[75vh] flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {groups.map((group) => (
          <Group
            key={group.id}
            group={group}
            itemIds={itemIds}
            disabledItemIds={disabledItemIds}
            onItemClick={(itemId, isChecked) => {
              if (isChecked) {
                onChange([...itemIds, itemId]);
              } else {
                onChange(itemIds.filter((id) => id !== itemId));
              }
            }}
          />
        ))}

        {isSearchEmpty && <li className="text-neutral-500">No results found</li>}
      </ol>

      <div className="bg-neutral-50 px-4 py-3">
        <Search placeholder="Search for item titles" searchKey={constants.searches.saveItems} />

        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
          onClick={() => {
            onSave();
            modal.hide();
          }}
        >
          Save
        </button>
      </div>
    </BottomSheet>
  );
};

export default SaveItemsModal;
