import { useCallback } from 'react';
import dayjs from 'dayjs';

import SettingsModal from 'components/modals/SettingsModal';
import Recurrence from 'components/Routine/RoutineSettingsModal/Recurrence';
import DeleteButton from 'components/DeleteButton';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const RoutineSettingsModal = () => {
  const modal = useModal(constants.modals.routineSettings);
  const saveModal = useModal(constants.modals.saveRoutine);
  const duplicateModal = useModal(constants.modals.duplicateRoutine);
  const { routine, setRoutine, removeRoutine } = useRoutinesStore((state) => {
    return {
      routine: state.routine,
      setRoutine: state.setRoutine,
      removeRoutine: () => state.routine && state.remove(state.routine.id),
    };
  });
  const { isInHistory, removeHistory } = useHistoriesStore(
    useCallback(
      (state) => {
        const date = dayjs().startOf('day').toISOString();
        const history = state.histories.find((history) => history.id === routine?.id && history.date === date);
        return { isInHistory: Boolean(history), removeHistory: () => history && state.remove(history.id, date) };
      },
      [routine],
    ),
  );

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
          children: 'Edit',
          onClick: () => {
            setRoutine(routine);
            saveModal.show();
          },
        },
        {
          children: 'Duplicate',
          onClick: () => {
            setRoutine(routine);
            duplicateModal.show();
          },
        },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                removeRoutine();
                modal.hide();
              }}
            />
          ),
        },
        {
          render: () => (
            <DeleteButton
              text="Delete History"
              onConfirm={() => {
                removeHistory();
                modal.hide();
              }}
            />
          ),
          skip: !isInHistory,
        },
      ]}
      data-testid="routine-settings-modal"
    />
  );
};

export default RoutineSettingsModal;
