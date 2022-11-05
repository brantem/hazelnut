import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Card from 'components/Card';
import ItemList from 'components/Routine/RoutineCard/ItemList';

import { useRoutinesStore } from 'lib/stores';
import type { Routine } from 'types/routine';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type RoutineProps = {
  routine: Routine;
  showAction?: boolean;
  isItemSortable?: boolean;
};

const RoutineCard = ({ routine, showAction, isItemSortable = false }: RoutineProps) => {
  const { setRoutine, edit } = useRoutinesStore((state) => ({ setRoutine: state.setRoutine, edit: state.edit }));
  const saveItemsModal = useModal(constants.modals.saveItemsToRoutine);
  const settingsModal = useModal(constants.modals.routineSettings);

  return (
    <Card
      color={routine.color}
      title={
        <>
          <span>{routine.title}</span>
          {routine.time && (
            <span className={`text-sm font-medium text-${routine.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
              {routine.time}
            </span>
          )}
        </>
      }
      actions={[
        {
          children: 'Items',
          onClick: () => {
            setRoutine(routine);
            saveItemsModal.show();
          },
          testId: 'routine-card-save-items',
          skip: !showAction,
        },
        {
          children: <EllipsisHorizontalIcon className="h-5 w-5" />,
          onClick: () => {
            setRoutine(routine);
            settingsModal.show();
          },
          testId: 'routine-card-settings',
          skip: !showAction,
        },
        {
          children: <ChevronUpIcon className={clsx('h-5 w-5', routine.minimized && 'rotate-180')} />,
          onClick: () => edit(routine.id, { minimized: !routine.minimized }),
          testId: 'routine-card-minimize',
        },
      ]}
      data-testid="routine-card"
    >
      {!routine.minimized && <ItemList routine={routine} isSortable={isItemSortable} />}
    </Card>
  );
};

export default RoutineCard;
