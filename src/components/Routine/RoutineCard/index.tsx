import { useCallback } from 'react';
import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import dayjs from 'dayjs';

import Card from 'components/Card';
import ItemList from 'components/Routine/RoutineCard/ItemList';
import Note from 'components/History/Note';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import type { Routine } from 'types/routine';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type RoutineProps = {
  routine: Routine;
  showAction?: boolean;
  isItemSortable?: boolean;
};

const RoutineCard = ({ routine, showAction, isItemSortable = false }: RoutineProps) => {
  const saveItemsModal = useModal(constants.modals.saveItemsToRoutine);
  const settingsModal = useModal(constants.modals.routineSettings);
  const saveNoteModal = useModal(constants.modals.saveHistoryNote);
  const { showSaveItemsModal, showSettingsModal, edit } = useRoutinesStore((state) => ({
    showSaveItemsModal: () => {
      state.setRoutine(routine);
      saveItemsModal.show();
    },
    showSettingsModal: () => {
      state.setRoutine(routine);
      settingsModal.show();
    },
    edit: (data: Parameters<typeof state.edit>[1]) => state.edit(routine.id, data),
  }));
  const { history, showSaveNoteModal } = useHistoriesStore(
    useCallback(
      (state) => {
        const currentDate = dayjs().startOf('day').toISOString();
        // prettier-ignore
        const history = routine.id && state.histories.find((history) => history.id === routine.id && history.date === currentDate);
        return {
          history: history || null,
          showSaveNoteModal: () => {
            /* c8 ignore next */
            if (!history) return;
            state.setHistory(history);
            saveNoteModal.show();
          },
        };
      },
      [routine.id],
    ),
  );

  return (
    <Card
      color={routine.color}
      title={
        <>
          <span>{routine.title}</span>
          {routine.time && (
            <span
              className={`text-sm font-medium text-${routine.color}-500 dark:text-${routine.color}-700 ml-2 flex-shrink-0 tabular-nums`}
            >
              {routine.time}
            </span>
          )}
        </>
      }
      actions={[
        {
          children: 'Items',
          onClick: showSaveItemsModal,
          testId: 'routine-card-save-items',
          skip: !showAction,
        },
        {
          children: <EllipsisHorizontalIcon className="h-5 w-5" />,
          onClick: showSettingsModal,
          testId: 'routine-card-settings',
          skip: !showAction,
        },
        {
          children: <ChevronUpIcon className={clsx('h-5 w-5', routine.minimized && 'rotate-180')} />,
          onClick: () => edit({ minimized: !routine.minimized }),
          testId: 'routine-card-minimize',
        },
      ]}
      data-testid="routine-card"
    >
      {!routine.minimized && <ItemList routine={routine} isSortable={isItemSortable} />}

      {!routine.minimized && history && <Note history={history} onActionClick={showSaveNoteModal} />}
    </Card>
  );
};

export default RoutineCard;
