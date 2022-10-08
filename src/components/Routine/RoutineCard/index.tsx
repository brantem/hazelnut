import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

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
    <div className={`px-4 py-3 bg-${routine.color}-50`} data-testid="routine-card">
      <div className="flex h-7 items-center justify-between space-x-3">
        <div className="flex max-w-[440px] items-center space-x-3">
          <h3 className={`text-sm font-semibold uppercase text-${routine.color}-600 truncate`}>{routine.title} </h3>
          <span className={`text-sm font-medium text-${routine.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
            {routine.time}
          </span>
        </div>

        <div className="flex flex-shrink-0 items-center space-x-1">
          {showAction && (
            <button
              className={`rounded-md px-2 py-1 text-sm hover:bg-${routine.color}-100 flex-shrink-0`}
              onClick={() => {
                setRoutine(routine);
                saveItemsModal.show();
              }}
              data-testid="routine-card-save-items"
            >
              Items
            </button>
          )}

          {showAction && (
            <button
              className={`rounded-md p-1 hover:bg-${routine.color}-100`}
              onClick={() => {
                setRoutine(routine);
                settingsModal.show();
              }}
              data-testid="routine-card-settings"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          )}

          <button
            className={clsx(`rounded-md p-1 hover:bg-${routine.color}-100`, routine.minimized && 'rotate-180')}
            onClick={() => edit(routine.id, { minimized: !routine.minimized })}
            data-testid="routine-card-minimize"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!routine.minimized && <ItemList routine={routine} isSortable={isItemSortable} />}
    </div>
  );
};

export default RoutineCard;
