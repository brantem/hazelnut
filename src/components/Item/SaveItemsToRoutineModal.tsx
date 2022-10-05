import { useEffect, useState } from 'react';

import BottomSheet from 'components/BottomSheet';
import Checkbox from 'components/Checkbox';

import { useRoutinesStore, useRoutineStore, useGroupsStore, useItemsStore } from 'lib/stores';

const SaveItemsToRoutineModal = () => {
  const { edit } = useRoutinesStore();
  const { routine, isSaveItemsOpen, hide, clear } = useRoutineStore();
  const { groups } = useGroupsStore();
  const { items } = useItemsStore();

  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!routine) {
      if (itemIds?.length) setItemIds([]);
      return;
    }
    setItemIds(routine.itemIds);
  }, [routine]);

  return (
    <BottomSheet
      isOpen={isSaveItemsOpen}
      onClose={hide}
      title="Items"
      data-testid="save-items-to-routine-modal"
      afterLeave={clear}
    >
      <ol className="space-y-3 px-4 py-3">
        {groups.map((group) => (
          <li key={group.id}>
            <div className="flex items-center space-x-3">
              <span className={`max-w-full flex-shrink-0 truncate text-${group.color}-500`}>{group.title}</span>

              <hr className="flex-1" />
            </div>

            <ol className="mt-1 space-y-1">
              {items.map((item) => {
                if (item.groupId !== group.id) return null;
                return (
                  <li key={item.id} className="flex items-center justify-between space-x-3">
                    <Checkbox
                      label={item.title}
                      name={item.id}
                      checked={itemIds.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setItemIds((prev) => [...prev, item.id]);
                        } else {
                          setItemIds((prev) => prev.filter((itemId) => itemId !== item.id));
                        }
                      }}
                    />
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>

      <div className="bg-neutral-50 px-4 py-3">
        <button
          type="submit"
          className="w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
          onClick={() => {
            // TODO: find a better way to remove deleted item ids
            edit(routine!.id, { itemIds: itemIds.filter((itemId) => items.find((item) => item.id === itemId)) });
            hide();
          }}
        >
          Save
        </button>
      </div>
    </BottomSheet>
  );
};

export default SaveItemsToRoutineModal;
