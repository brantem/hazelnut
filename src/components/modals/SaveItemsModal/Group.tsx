import { useCallback, useReducer } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Checkbox from 'components/Checkbox';

import { useItemsStore } from 'lib/stores';
import { Group as _Group } from 'types/group';
import { isMatch } from 'lib/helpers';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

type GroupProps = {
  group: _Group;
  itemIds: string[];
  onItemClick: (itemId: string, isChecked: boolean) => void;
};

export const Group = ({ group, itemIds, onItemClick }: GroupProps) => {
  const search = useSearch(constants.searches.saveItems);
  const items = useItemsStore(
    useCallback(
      (state) => {
        const items = state.getItemsByGroupId(group.id);
        if (!search.value) return items;
        return items.filter((item) => isMatch(item.title, search.value));
      },
      [group.id, search.value],
    ),
  );

  const [minimized, toggle] = useReducer((prev) => !prev, false);

  if (!items.length) return null;

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
          {items.map((item) => (
            <li key={item.id} className="flex h-8 items-center pr-1">
              <Checkbox
                label={item.title}
                name={item.id}
                checked={itemIds.includes(item.id)}
                onChange={(e) => onItemClick(item.id, e.target.checked)}
              />
            </li>
          ))}
        </ol>
      )}
    </li>
  );
};

export default Group;