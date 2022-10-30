import { useEffect, useState } from 'react';

import SaveItemsModal from 'components/modals/SaveItemsModal';

import { useRoutinesStore, useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';

const SaveItemsToRoutineModal = () => {
  const { routine, edit } = useRoutinesStore((state) => ({ routine: state.routine, edit: state.edit }));

  const getItemIdsByIds = useItemsStore((state) => state.getItemIdsByIds);

  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!routine) return;
    setItemIds(routine.itemIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine]);

  return (
    <SaveItemsModal
      modalKey={constants.modals.saveItemsToRoutine}
      itemIds={itemIds}
      onItemClick={(itemId, isChecked) => {
        if (isChecked) {
          setItemIds((prev) => [...prev, itemId]);
        } else {
          setItemIds((prev) => prev.filter((id) => id !== itemId));
        }
      }}
      onSave={() => edit(routine!.id, { itemIds: getItemIdsByIds(itemIds) })}
    />
  );
};

export default SaveItemsToRoutineModal;
