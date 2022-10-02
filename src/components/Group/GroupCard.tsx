import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

import type { Group as _Group } from 'types/group';

type GroupProps = {
  group: _Group;
  onSettingsClick: () => void;
};

const Group = ({ group, onSettingsClick }: GroupProps) => {
  return (
    <div className={`px-4 py-3 bg-${group.color}-50`} data-testid="group-card">
      <div className="flex justify-between items-center space-x-3">
        <h3 className={`uppercase text-sm font-semibold text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button className={`px-2 py-1 text-sm rounded-md hover:bg-${group.color}-100 flex-shrink-0`}>Add Item</button>

          <button
            className={`p-1 rounded-md hover:bg-${group.color}-100`}
            onClick={onSettingsClick}
            data-testid="group-card-settings"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ol className="space-y-1 py-1">
        {group.items.map((item, j) => (
          <li key={j}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default Group;
