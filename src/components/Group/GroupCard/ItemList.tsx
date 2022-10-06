import { useCallback } from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import DeleteButton from 'components/DeleteButton';

import { useItemsStore } from 'lib/stores';
import type { Group } from 'types/group';

type ItemListProps = {
  group: Group;
};

const ItemList = ({ group }: ItemListProps) => {
  const items = useItemsStore(useCallback((state) => state.getItemsByGroupId(group.id), [group.id]));
  const remove = useItemsStore((state) => state.remove);

  return (
    <ol className="space-y-1 pt-2 pb-1" data-testid="group-card-items">
      {items.map((item) => (
        <li data-testid="group-card-items-item" key={item.id} className="flex items-center justify-between space-x-3">
          <span className="truncate">{item.title}</span>

          <DeleteButton
            className={(clicked) => clsx(`rounded-md !p-1 text-sm text-red-500 hover:bg-red-100`, clicked && '!px-2')}
            text={<MinusCircleIcon className="h-5 w-5" />}
            onConfirm={() => remove(item.id)}
          />
        </li>
      ))}
    </ol>
  );
};

export default ItemList;
