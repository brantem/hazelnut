import BottomSheet from 'components/BottomSheet';
import Days from 'components/Days';
import DeleteButton from 'components/DeleteButton';

import { useRoutinesStore } from 'lib/stores';

const RoutineSettingsModal = () => {
  const { routine, showSave, showDuplicate, isSettingsOpen, hide, resetAfterHide, remove } = useRoutinesStore();

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={routine?.title}
      data-testid="routine-settings-modal"
      afterLeave={resetAfterHide}
    >
      <div className="-mt-2 flex items-center justify-between space-x-3 px-4 text-base font-normal text-neutral-500">
        <span>{routine?.time}</span>
        <Days days={routine?.days || []} />
      </div>

      <div className="flex flex-col py-3">
        <button className="px-4 py-2 text-left hover:bg-neutral-100" onClick={() => showSave()}>
          Edit
        </button>

        <button className="px-4 py-2 text-left hover:bg-neutral-100" onClick={() => routine && showDuplicate(routine)}>
          Duplicate
        </button>

        <DeleteButton
          onConfirm={() => {
            remove(routine!.id);
            hide();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default RoutineSettingsModal;
