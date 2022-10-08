import { useCallback } from 'react';

import BottomSheet from 'components/BottomSheet';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore, useItemsStore } from 'lib/stores';

const GroupSettingsModal = () => {
  const { group, showSave, isSettingsOpen, hide, resetAfterHide, remove } = useGroupsStore();
  const itemsLength = useItemsStore(
    useCallback(
      (state) => {
        if (!group?.id) return 0;
        return state.getItemsByGroupId(group.id).length;
      },
      [group?.id],
    ),
  );

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={group?.title}
      data-testid="group-settings-modal"
      afterLeave={resetAfterHide}
    >
      <div className="-mt-2 flex items-center justify-between space-x-3 px-4 text-base font-normal text-neutral-500">
        {itemsLength} Item(s)
      </div>

      <div className="flex flex-col py-3">
        <button className="px-4 py-2 text-left hover:bg-neutral-100" onClick={() => showSave()}>
          Edit
        </button>

        <DeleteButton
          onConfirm={() => {
            remove(group!.id);
            hide();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default GroupSettingsModal;
