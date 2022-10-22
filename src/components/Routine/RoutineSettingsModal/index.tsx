import SettingsModal from 'components/modals/SettingsModal';
import Recurrence from 'components/Routine/RoutineSettingsModal/Recurrence';
import DeleteButton from 'components/DeleteButton';

import { useRoutinesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const RoutineSettingsModal = () => {
  const modal = useModal(constants.modals.routineSettings);
  const saveModal = useModal(constants.modals.saveRoutine);
  const duplicateModal = useModal(constants.modals.duplicateRoutine);
  const { routine, setRoutine, remove } = useRoutinesStore((state) => ({
    routine: state.routine,
    setRoutine: state.setRoutine,
    remove: state.remove,
  }));

  return (
    <SettingsModal
      title={routine?.title}
      description={
        <div className="flex w-full flex-col space-y-2">
          <div className="flex items-center justify-between space-x-3">
            <span>{routine?.time ? routine.time : 'All day'}</span>
            <span>{routine?.itemIds.length} Item(s)</span>
          </div>
          {routine && <Recurrence recurrence={routine.recurrence} />}
        </div>
      }
      modalKey={constants.modals.routineSettings}
      actions={[
        {
          text: 'Edit',
          onClick: () => {
            setRoutine(routine);
            saveModal.show();
          },
        },
        {
          text: 'Duplicate',
          onClick: () => {
            setRoutine(routine);
            duplicateModal.show();
          },
        },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(routine!.id);
                modal.hide();
              }}
            />
          ),
        },
      ]}
      data-testid="routine-settings-modal"
    />
  );
};

export default RoutineSettingsModal;
