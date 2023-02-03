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
  const saveHistoryNoteModal = useModal(constants.modals.saveHistoryNote);
  const duplicateModal = useModal(constants.modals.duplicateRoutine);
  const { routine, showEditRoutineModal, showDuplicateRoutineModal, removeRoutine } = useRoutinesStore((state) => {
    return {
      routine: state.routine,
      showEditRoutineModal: () => {
        state.setRoutine(routine);
        saveModal.show();
      },
      showDuplicateRoutineModal: () => {
        state.setRoutine(routine);
        duplicateModal.show();
      },
      removeRoutine: () => {
        /* c8 ignore next */
        if (!state.routine) return;
        state.remove(state.routine.id);
        modal.hide();
      },
    };
  });
  const { history, showSaveNoteModal, removeHistory } = useHistoriesStore(
    useCallback(
      (state) => {
        const currentDate = dayjs().startOf('day').toISOString();
        const history = routine?.id
          ? state.histories.find((history) => history.id === routine.id && history.date === currentDate)
          : null;
        return {
          history,
          showSaveNoteModal: () => {
            /* c8 ignore next */
            if (!history) return;
            state.setHistory(history);
            saveHistoryNoteModal.show();
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
          onClick: showEditRoutineModal,
        },
        {
          children: history?.note ? 'Edit Note' : 'Add Note',
          onClick: showSaveNoteModal,
          skip: !history,
        },
        {
          children: 'Duplicate',
          onClick: showDuplicateRoutineModal,
        },
        { render: () => <DeleteButton onConfirm={removeRoutine} /> },
        { render: () => <DeleteButton text="Delete History" onConfirm={removeHistory} />, skip: !history },
      ]}
      data-testid="routine-settings-modal"
    />
  );
};

export default RoutineSettingsModal;
