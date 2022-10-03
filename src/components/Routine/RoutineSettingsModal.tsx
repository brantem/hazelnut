import { useMemo } from 'react';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';
import Days from 'components/Days';
import DeleteButton from 'components/DeleteButton';

import { useRoutinesStore } from 'lib/stores';

type RoutineSettingsModal = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  routineId: string;
  onEditClick: () => void;
};

const RoutineSettingsModal = ({ isOpen, onClose, routineId, onEditClick }: RoutineSettingsModal) => {
  const { routines, remove } = useRoutinesStore();
  const routine = useMemo(() => {
    if (!routineId) return null;
    return routines.find((routine) => routine.id === routineId);
  }, [routines, routineId]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        routine && (
          <>
            <span>{routine?.title}</span>
            <div className="flex items-center justify-between space-x-3 text-base font-normal mt-1 text-neutral-500">
              <span>{routine?.time}</span>
              <Days days={routine?.days} />
            </div>
          </>
        )
      }
      data-testid="routine-settings-modal"
    >
      <div className="px-2 pb-3 flex flex-col">
        <button className="rounded-md px-3 py-2 text-left hover:bg-neutral-100" onClick={onEditClick}>
          Edit
        </button>

        <DeleteButton
          onConfirm={() => {
            remove(routineId);
            onClose();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default RoutineSettingsModal;
