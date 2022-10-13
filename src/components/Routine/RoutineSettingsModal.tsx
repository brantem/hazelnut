import SettingsModal from 'components/modals/SettingsModal';
import Days from 'components/Days';
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
        <>
          {routine?.time && <span>{routine?.time}</span>}
          <span>{routine?.itemIds.length} Item(s)</span>
          <Days days={routine?.days || []} />
        </>
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
