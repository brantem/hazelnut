import { useEffect, useMemo, useState } from 'react';

import SaveItemsModal from 'components/modals/SaveItemsModal';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';

const SaveHistoryItemsModal = () => {
  const { history, addItems, removeItems } = useHistoriesStore((state) => ({
    history: state.history,
    addItems: state.addItems,
    removeItems: state.removeItems,
  }));
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
      onChange={(_itemIds) => setItemIds(_itemIds)}
      onSave={() => {
        const removedItemIds = _itemIds.filter((itemId) => !itemIds.includes(itemId));
        if (removedItemIds.length) removeItems(history!.id, history!.date, removedItemIds);

        const newItemIds = itemIds.filter((itemId) => !_itemIds.includes(itemId));
        if (newItemIds.length) addItems(history!.id, history!.date, newItemIds);
      }}
    />
  );
};

export default SaveHistoryItemsModal;
