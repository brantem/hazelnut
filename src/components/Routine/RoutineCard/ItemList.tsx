import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

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
  const _item = useHistoriesStore(
    useCallback((state) => state.getItem(routine.id, item.id, true), [routine.id, item.id]),
  );
  const saveItem = useHistoriesStore((state) => state.saveItem);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      className="flex h-8 w-full items-center justify-between space-x-2 pr-1"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      {isSortable && (
        <button
          className="-ml-1.5 flex-grow-0 p-1.5"
          ref={setActivatorNodeRef}
          {...listeners}
          data-testid="routine-item-handle"
        >
          <svg viewBox="0 0 20 20" width="12" className="h-4 w-4 text-neutral-500" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
      )}

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
    </li>
  );
};

type ItemListProps = {
  routine: Routine;
  isSortable?: boolean;
};

const ItemList = ({ routine, isSortable }: ItemListProps) => {
  const edit = useRoutinesStore((state) => state.edit);
  const items = useItemsStore(useCallback((state) => state.getItemsByIds(routine.itemIds), [routine.itemIds]));
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [itemId, setItemId] = useState<UniqueIdentifier | null>(null);
  const activeIndex = items.findIndex((item) => item.id === itemId);

  if (!items.length) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => active && setItemId(active.id)}
      onDragEnd={({ over }) => {
        setItemId(null);
        if (!over) return;
        const overIndex = items.findIndex((item) => item.id === over.id);
        if (activeIndex === overIndex) return;
        edit(routine.id, { itemIds: arrayMove(items.map((item) => item.id), activeIndex, overIndex) }); // prettier-ignore
      }}
      onDragCancel={() => setItemId(null)}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="space-y-1 pt-1" data-testid="routine-card-items">
          {items.map((item) => (
            <Item key={item.id} routine={routine} item={item} isSortable={isSortable} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
};

export default ItemList;
