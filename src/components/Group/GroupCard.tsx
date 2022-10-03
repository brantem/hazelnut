import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import DeleteButton from 'components/DeleteButton';

import { useGroupStore, useItemsStore, useItemStore } from 'lib/stores';
import type { Group } from 'types/group';

type GroupCardProps = {
  group: Group;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { showSettings } = useGroupStore();
  const items = useItemsStore((state) => state.items.filter((item) => item.groupId === group.id));
  const { remove } = useItemsStore();
  const { showAdd } = useItemStore();

  return (
    <div className={`px-4 py-3 bg-${group.color}-50`} data-testid="group-card">
      <div className="flex justify-between items-center space-x-3">
        <h3 className={`uppercase text-sm font-semibold text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            className={`px-2 py-1 text-sm rounded-md hover:bg-${group.color}-100 flex-shrink-0`}
            onClick={() => showAdd(group.id)}
          >
            Add Item
          </button>

          <button
            className={`p-1 rounded-md hover:bg-${group.color}-100`}
            onClick={() => showSettings(group)}
            data-testid="group-card-settings"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {items.length ? (
        <ol className="space-y-1 pt-2 pb-1" data-testid="group-card-items">
          {items.map((item) => (
            <li
              data-testid="group-card-items-item"
              key={item.id}
              className="flex justify-between items-center space-x-3"
            >
              <span className="truncate">{item.title}</span>

              <DeleteButton
                className={(isClicked) =>
                  clsx(`hover:bg-red-100 text-red-500 text-sm`, isClicked ? 'px-2 py-1.5' : 'p-1.5')
                }
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
