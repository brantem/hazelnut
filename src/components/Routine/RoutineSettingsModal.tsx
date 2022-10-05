import BottomSheet from 'components/BottomSheet';
import Days from 'components/Days';
import DeleteButton from 'components/DeleteButton';

import { useRoutinesStore } from 'lib/stores';

const RoutineSettingsModal = () => {
  const { routine, isSaveOpen, showSave, isSettingsOpen, hide, resetAfterHide, remove } = useRoutinesStore();

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={
        routine && (
          <>
            <span>{routine?.title}</span>
            <div className="mt-1 flex items-center justify-between space-x-3 text-base font-normal text-neutral-500">
              <span>{routine?.time}</span>
              <Days days={routine?.days} />
            </div>
          </>
        )
      }
      data-testid="routine-settings-modal"
      afterLeave={() => !isSaveOpen && resetAfterHide()}
    >
      <div className="flex flex-col px-2 pb-3">
        <button className="rounded-md px-3 py-2 text-left hover:bg-neutral-100" onClick={() => showSave()}>
          Edit
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
