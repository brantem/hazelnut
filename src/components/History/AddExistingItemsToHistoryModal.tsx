import { useEffect, useMemo, useState } from 'react';

import SaveItemsModal from 'components/modals/SaveItemsModal';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';

const AddExistingItemsToHistoryModal = () => {
  const { history, addItems } = useHistoriesStore((state) => ({ history: state.history, addItems: state.addItems }));
  const _itemIds = useMemo(() => {
    if (!history) return [];
    return history.items.map((item) => item.id);
  }, [history]);

  const [itemIds, setItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (!history) return;
    setItemIds(_itemIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <SaveItemsModal
      modalKey={constants.modals.addExistingItemsToHistory}
      itemIds={itemIds}
      disabledItemIds={_itemIds}
      onChange={(_itemIds) => setItemIds(_itemIds)}
      onSave={() => {
        const newItemIds = itemIds.filter((itemId) => !_itemIds.includes(itemId));
        addItems(history!.id, history!.date, newItemIds);
      }}
    />
  );
};

export default AddExistingItemsToHistoryModal;
