import { useState, useMemo } from 'react';
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

import Checkbox from 'components/Checkbox';

import { useItemsStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Item as _Item } from 'types/item';

type ItemProps = {
  routine: Routine;
  item: _Item;
  isDraggable: boolean;
};

const Item = ({ routine, item, isDraggable }: ItemProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      data-testid="routine-card-items-item"
      className="flex h-7 items-center justify-between space-x-2"
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      {isDraggable && (
        <button
          className="-ml-1.5 p-1.5"
          ref={setActivatorNodeRef}
          {...listeners}
          data-testid="routine-card-items-item-handle"
        >
          <svg viewBox="0 0 20 20" width="12" className="h-4 w-4 text-neutral-500" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
      )}

      <Checkbox label={item.title} name={routine.id + '-' + item.id} color={routine.color} />
    </li>
  );
};

type ItemListProps = {
  routine: Routine;
  isDraggable: boolean;
};

const ItemList = ({ routine, isDraggable }: ItemListProps) => {
  const { edit } = useRoutinesStore();
  const { items: baseItems } = useItemsStore();
  const items = useMemo(() => {
    const items = [];
    for (const itemId of routine.itemIds) {
      const item = baseItems.find((item) => item.id === itemId);
      if (item) items.push(item);
    }
    return items;
  }, [routine.itemIds, baseItems]);
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
        edit(routine.id, { itemIds: arrayMove(routine.itemIds, activeIndex, overIndex) });
      }}
      onDragCancel={() => setItemId(null)}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="space-y-1 pt-2 pb-1" data-testid="routine-card-items">
          {items.map((item) => (
            <Item key={item.id} routine={routine} item={item} isDraggable={isDraggable} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
};

export default ItemList;
