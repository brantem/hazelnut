import { useReducer } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Checkbox from 'components/Checkbox';

import { useItemsStore } from 'lib/stores';
import { Group as _Group } from 'types/group';

type GroupProps = {
  group: _Group;
  itemIds: string[];
  onItemClick: (isChecked: boolean, itemId: string) => void;
};

export const Group = ({ group, itemIds, onItemClick }: GroupProps) => {
  const { items } = useItemsStore();

  const [minimized, toggle] = useReducer((prev) => !prev, false);

  return (
    <li>
      <div className="flex items-center space-x-3">
        <span className={`max-w-full flex-shrink-0 truncate text-${group.color}-500 font-semibold`}>{group.title}</span>

        <hr className="flex-1" />

        <button className={clsx('-mr-1 p-1', minimized && 'rotate-180')} onClick={toggle} data-testid="group-minimize">
          <ChevronUpIcon className="h-5 w-5" />
        </button>
      </div>

      {!minimized && (
        <ol className="mt-1 space-y-1" data-testid="group-items">
          {items.map((item) => {
            if (item.groupId !== group.id) return null;
            return (
              <li key={item.id} className="flex h-7 items-center pr-1">
                <Checkbox
                  label={item.title}
                  name={item.id}
                  checked={itemIds.includes(item.id)}
                  onChange={(e) => onItemClick(e.target.checked, item.id)}
                />
              </li>
            );
          })}
        </ol>
      )}
    </li>
  );
};

export default Group;
