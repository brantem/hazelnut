import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
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

import { cn } from 'lib/helpers';

export type SortableItem = {
  as?: React.ElementType;
  className?: string;
  itemId: string;
  handle?: object | null;
  children: React.ReactNode;
};

export const SortableItem = ({ as: Component = 'div', itemId, className, handle = {}, children }: SortableItem) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id: itemId });

  return (
    <Component
      ref={setNodeRef}
      className={cn('flex w-full items-center justify-between space-x-2 pr-1', className)}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      {handle && (
        <button {...handle} ref={setActivatorNodeRef} {...listeners}>
          <svg viewBox="0 0 20 20" width="12" className="h-4 w-4" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
      )}

      {children}
    </Component>
  );
};

export type SortableProps = {
  itemIds: string[];
  onChange: (itemIds: string[]) => void;
  children: React.ReactNode;
};

const Sortable = ({ itemIds, onChange, children }: SortableProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [itemId, setItemId] = useState<string>('');
  const activeIndex = itemIds.indexOf(itemId);

  if (!itemIds.length) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => active && setItemId(active.id as string)}
      onDragEnd={({ over }) => {
        setItemId('');
        if (!over) return;
        const overIndex = itemIds.indexOf(over.id as string);
        if (activeIndex === overIndex) return;
        onChange(arrayMove(itemIds, activeIndex, overIndex));
      }}
      onDragCancel={() => setItemId('')}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default Sortable;
