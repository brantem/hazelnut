import BottomSheet from 'components/BottomSheet';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore, useGroupStore } from 'lib/stores';

const GroupSettingsModal = () => {
  const { remove } = useGroupsStore();
  const { group, clear, isSaveOpen, showSave, isSettingsOpen, hide } = useGroupStore();

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={group?.title}
      data-testid="group-settings-modal"
      afterLeave={() => !isSaveOpen && clear()}
    >
      <div className="flex flex-col px-2 pb-3">
        <button className="rounded-md px-3 py-2 text-left hover:bg-neutral-100" onClick={() => showSave()}>
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
