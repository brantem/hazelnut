import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

import type { Routine as _Routine } from 'types/routine';

type RoutineProps = {
  routine: _Routine;

  onSettingsClick: () => void;
};

const Routine = ({ routine, onSettingsClick }: RoutineProps) => {
  return (
    <div className={`px-4 py-3 bg-${routine.color}-50`} data-testid="routine-card">
      <div className="flex justify-between items-center space-x-3">
        <h3 className={`uppercase text-sm font-semibold text-${routine.color}-600 truncate`}>{routine.title}</h3>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            className={`p-1 rounded-md hover:bg-${routine.color}-100`}
            onClick={onSettingsClick}
            data-testid="routine-card-settings"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Routine;
