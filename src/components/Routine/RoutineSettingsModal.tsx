import SettingsModal from 'components/modals/SettingsModal';
import Days from 'components/Days';
import DeleteButton from 'components/DeleteButton';

import { useModalStore, useRoutinesStore } from 'lib/stores';
import { modals } from 'data/constants';

const RoutineSettingsModal = () => {
  const { hide } = useModalStore(modals.routineSettings);
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
      modalKey={modals.routineSettings}
      actions={[
        { text: 'Edit', onClick: () => showSave(routine) },
        { text: 'Duplicate', onClick: () => routine && showDuplicate(routine) },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(routine!.id);
                hide();
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
