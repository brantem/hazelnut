import SettingsModal from 'components/modals/SettingsModal';
import Days from 'components/Days';
import DeleteButton from 'components/DeleteButton';

import { useRoutinesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const RoutineSettingsModal = () => {
  const modal = useModal(constants.modals.routineSettings);
  const { routine, showSave, showDuplicate, remove } = useRoutinesStore((state) => ({
    routine: state.routine,
    showSave: state.showSave,
    showDuplicate: state.showDuplicate,
    remove: state.remove,
  }));

  return (
    <SettingsModal
      title={routine?.title}
      description={
        <>
          <span>{routine?.time}</span>
          <Days days={routine?.days || []} />
        </>
      }
      modalKey={constants.modals.routineSettings}
      actions={[
        { text: 'Edit', onClick: () => showSave(routine) },
        { text: 'Duplicate', onClick: () => routine && showDuplicate(routine) },
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
