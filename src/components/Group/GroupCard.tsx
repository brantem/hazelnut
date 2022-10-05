import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import DeleteButton from 'components/DeleteButton';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import type { Group } from 'types/group';

type GroupCardProps = {
  group: Group;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { showSettings } = useGroupsStore();
  const items = useItemsStore((state) => state.items.filter((item) => item.groupId === group.id));
  const { showAdd, remove } = useItemsStore();

  return (
    <div className={`px-4 py-3 bg-${group.color}-50`} data-testid="group-card">
      <div className="flex items-center justify-between space-x-3">
        <h3 className={`text-sm font-semibold uppercase text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex flex-shrink-0 items-center space-x-1">
          <button
            className={`rounded-md px-2 py-1 text-sm hover:bg-${group.color}-100 flex-shrink-0`}
            onClick={() => showAdd(group.id)}
          >
            Add Item
          </button>

          <button
            className={`rounded-md p-1 hover:bg-${group.color}-100`}
            onClick={() => showSettings(group)}
            data-testid="group-card-settings"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {items.length ? (
        <ol className="space-y-1 pt-2 pb-1" data-testid="group-card-items">
          {items.map((item) => (
            <li
              data-testid="group-card-items-item"
              key={item.id}
              className="flex items-center justify-between space-x-3"
            >
              <span className="truncate">{item.title}</span>

              <DeleteButton
                className={(clicked) => clsx(`rounded-md p-1 text-sm text-red-500 hover:bg-red-100`, clicked && 'px-2')}
                text={<MinusCircleIcon className="h-5 w-5" />}
                onConfirm={() => remove(item.id)}
              />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
};

export default GroupCard;
