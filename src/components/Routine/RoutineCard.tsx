import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

import { useRoutineStore } from 'lib/stores';
import type { Routine } from 'types/routine';

type RoutineProps = {
  routine: Routine;
  showAction?: boolean;
};

const RoutineCard = ({ routine, showAction }: RoutineProps) => {
  const { showSaveItems, showSettings } = useRoutineStore();

  return (
    <div className={`px-4 py-3 bg-${routine.color}-50`} data-testid="routine-card">
      <div className="flex justify-between items-center space-x-3 h-7">
        <div className="flex items-center space-x-3 max-w-[440px]">
          <h3 className={`uppercase text-sm font-semibold text-${routine.color}-600 truncate`}>{routine.title} </h3>
          <span className={`font-medium text-sm text-${routine.color}-400 ml-2 tabular-nums flex-shrink-0`}>
            {routine.time}
          </span>
        </div>

        {showAction && (
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              className={`px-2 py-1 text-sm rounded-md hover:bg-${routine.color}-100 flex-shrink-0`}
              onClick={() => showSaveItems(routine)}
              data-testid="routine-card-items"
            >
              Items
            </button>

            <button
              className={`p-1 rounded-md hover:bg-${routine.color}-100`}
              onClick={() => showSettings(routine)}
              data-testid="routine-card-settings"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineCard;
