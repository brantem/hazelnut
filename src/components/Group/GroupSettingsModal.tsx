import BottomSheet from 'components/BottomSheet';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore } from 'lib/stores';

const GroupSettingsModal = () => {
  const { group, isSaveOpen, showSave, isSettingsOpen, hide, resetAfterHide, remove } = useGroupsStore();

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={group?.title}
      data-testid="group-settings-modal"
      afterLeave={() => !isSaveOpen && resetAfterHide()}
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
