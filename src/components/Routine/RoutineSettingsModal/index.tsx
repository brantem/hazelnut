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
  const saveNoteModal = useModal(constants.modals.saveHistoryNote);
  const duplicateModal = useModal(constants.modals.duplicateRoutine);
  const { routine, remove } = useRoutinesStore((state) => {
    return {
      routine: state.routine,
      remove: () => {
        state.remove(state.routine!.id);
        modal.hide();
      },
    };
  });
  const { history, saveSaveNoteModal, removeHistory } = useHistoriesStore(
    useCallback(
      (state) => {
        const currentDate = dayjs().startOf('day').toISOString();
        const history = routine?.id
          ? state.histories.find((history) => history.id === routine.id && history.date === currentDate)
          : null;
        return {
          history,
          saveSaveNoteModal: () => {
            /* c8 ignore next */
            if (!history) return;
            modal.hide();
            state.setHistory(history);
            saveNoteModal.show();
          },
          removeHistory: () => {
            /* c8 ignore next */
            if (!history) return;
            state.remove(history.id, history.date);
            modal.hide();
          },
        };
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
            modal.hide();
            saveModal.show();
          },
        },
        {
          children: history?.note ? 'Edit Note' : 'Add Note',
          onClick: saveSaveNoteModal,
          skip: !history,
        },
        {
          children: 'Duplicate',
          onClick: () => {
            modal.hide();
            duplicateModal.show();
          },
        },
        {
          render: () => <DeleteButton onConfirm={remove} />,
        },
        {
          render: () => <DeleteButton text="Delete History" onConfirm={removeHistory} />,
          skip: !history,
        },
      ]}
      data-testid="routine-settings-modal"
    />
  );
};

export default RoutineSettingsModal;
