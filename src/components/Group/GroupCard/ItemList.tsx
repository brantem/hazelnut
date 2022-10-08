import { useCallback } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

import { useItemsStore } from 'lib/stores';
import type { Group } from 'types/group';
import { isMatch } from 'lib/helpers';
import * as constants from 'data/constants';
import { useSearch, useModal } from 'lib/hooks';

type ItemListProps = {
  group: Group;
};

const ItemList = ({ group }: ItemListProps) => {
  const search = useSearch(constants.searches.items);
  const setItem = useItemsStore((state) => state.setItem);
  const settingsModal = useModal(constants.modals.itemSettings);
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

  if (!items.length) return null;

  return (
    <ol className="space-y-1 pt-2 pb-1" data-testid="group-card-items">
      {items.map((item) => (
        <li key={item.id} className="flex h-7 items-center justify-between space-x-3">
          <span className="truncate">{item.title}</span>

          <button
            className={`rounded-md p-1 hover:bg-${group.color}-100`}
            onClick={() => {
              setItem(item);
              settingsModal.show();
            }}
            data-testid="group-item-settings"
          >
            <EllipsisHorizontalIcon className="h-[18px] w-[18px]" />
          </button>
        </li>
      ))}
    </ol>
  );
};

export default ItemList;
