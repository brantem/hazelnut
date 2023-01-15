import { useCallback } from 'react';
import clsx from 'clsx';

import Sortable, { SortableItem } from 'components/Sortable';
import Checkbox from 'components/Checkbox';
import NumberInput from 'components/NumberInput';

import { useItemsStore, useRoutinesStore, useHistoriesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item as _Item, ItemType } from 'types/item';
import { getNumberInputShade } from 'lib/helpers';

type ItemProps = {
  routine: Routine;
  item: _Item;
  isSortable?: boolean;
};

const Item = ({ routine, item, isSortable }: ItemProps) => {
  const _item = useHistoriesStore(useCallback((state) => state.getItem(routine.id, item.id), [routine.id, item.id]));
  const saveItem = useHistoriesStore((state) => state.saveItem);

  return (
    <SortableItem
      as="li"
      className="h-8"
      itemId={item.id}
      handle={
        isSortable
          ? {
              className: '-ml-1.5 flex-grow-0 p-1.5 text-neutral-500',
              'data-testid': 'routine-item-handle',
            }
          : null
      }
    >
      <div className={clsx('w-full', isSortable && 'max-w-[calc(100%-theme(spacing.8))]')}>
        {item.type === ItemType.Number ? (
          (() => {
            const minCompleted = item.settings.minCompleted;
            const value = _item?.value || 0;
            const shade = getNumberInputShade(minCompleted, value);
            return (
              <NumberInput
                label={item.title}
                color={routine.color}
                value={value}
                renderValue={(value) => `${value} / ${minCompleted}`}
                onChange={(value) => saveItem(routine.id, item.id, { value, done: value >= minCompleted }, true)}
                className={clsx(shade > 0 && `bg-${routine.color}-${shade}`, shade > 300 && 'text-white')}
                step={item.settings.step}
              />
            );
          })()
        ) : (
          <Checkbox
            label={item.title}
            name={routine.id + '-' + item.id}
            color={routine.color}
            checked={!!_item?.completedAt}
            onChange={(e) => saveItem(routine.id, item.id, { done: e.target.checked }, true)}
          />
        )}
      </div>
    </SortableItem>
  );
};

type ItemListProps = {
  routine: Routine;
  isSortable?: boolean;
};

const ItemList = ({ routine, isSortable }: ItemListProps) => {
  const edit = useRoutinesStore((state) => state.edit);
  const items = useItemsStore(useCallback((state) => state.getItemsByIds(routine.itemIds), [routine.itemIds]));

  return (
    <ol className="space-y-1 pt-1" data-testid="routine-card-items">
      <Sortable itemIds={items.map((item) => item.id)} onChange={(itemIds) => edit(routine.id, { itemIds })}>
        {items.map((item) => (
          <Item key={item.id} routine={routine} item={item} isSortable={isSortable} />
        ))}
      </Sortable>
    </ol>
  );
};

export default ItemList;
