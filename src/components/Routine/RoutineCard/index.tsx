import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

import Checkbox from 'components/Checkbox';

import { useItemsStore, useRoutineStore } from 'lib/stores';
import type { Routine } from 'types/routine';

type RoutineProps = {
  routine: Routine;
  showAction?: boolean;
};

const RoutineCard = ({ routine, showAction }: RoutineProps) => {
  const { showSaveItems, showSettings } = useRoutineStore();
  const items = useItemsStore((state) => state.items.filter((item) => routine.itemIds.includes(item.id)));

  return (
    <div className={`px-4 py-3 bg-${routine.color}-50`} data-testid="routine-card">
      <div className="flex h-7 items-center justify-between space-x-3">
        <div className="flex max-w-[440px] items-center space-x-3">
          <h3 className={`text-sm font-semibold uppercase text-${routine.color}-600 truncate`}>{routine.title} </h3>
          <span className={`text-sm font-medium text-${routine.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
            {routine.time}
          </span>
        </div>

        {showAction && (
          <div className="flex flex-shrink-0 items-center space-x-1">
            <button
              className={`rounded-md px-2 py-1 text-sm hover:bg-${routine.color}-100 flex-shrink-0`}
              onClick={() => showSaveItems(routine)}
              data-testid="routine-card-save-items"
            >
              Items
            </button>

            <button
              className={`rounded-md p-1 hover:bg-${routine.color}-100`}
              onClick={() => showSettings(routine)}
              data-testid="routine-card-settings"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {items.length ? (
        <ol className="space-y-1 pt-2 pb-1" data-testid="routine-card-items">
          {items.map((item) => (
            <li
              data-testid="routine-card-items-item"
              key={item.id}
              className="flex items-center justify-between space-x-3"
            >
              <Checkbox label={item.title} name={routine.id + '-' + item.id} color={routine.color} />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
};

export default RoutineCard;
