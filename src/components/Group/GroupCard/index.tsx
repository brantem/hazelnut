import { EllipsisHorizontalIcon, PlusIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

import clsx from 'clsx';

import ItemList from 'components/Group/GroupCard/ItemList';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import type { Group } from 'types/group';

type GroupCardProps = {
  group: Group;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { showSettings, edit } = useGroupsStore();
  const { showAdd } = useItemsStore();

  return (
    <div className={`px-4 py-3 bg-${group.color}-50`} data-testid="group-card">
      <div className="flex items-center justify-between space-x-3">
        <h3 className={`text-sm font-semibold uppercase text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex flex-shrink-0 items-center space-x-1">
          <button
            className={`rounded-md p-1 text-sm hover:bg-${group.color}-100 flex-shrink-0`}
            onClick={() => showAdd(group.id)}
            data-testid="group-card-add-item"
          >
            <PlusIcon className="h-5 w-5" />
          </button>

          <button
            className={`rounded-md p-1 hover:bg-${group.color}-100`}
            onClick={() => showSettings(group)}
            data-testid="group-card-settings"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>

          <button
            className={clsx(`rounded-md p-1 hover:bg-${group.color}-100`, group.minimized && 'rotate-180')}
            onClick={() => edit(group.id, { minimized: !group.minimized })}
            data-testid="group-card-minimize"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!group.minimized && <ItemList group={group} />}
    </div>
  );
};

export default GroupCard;
