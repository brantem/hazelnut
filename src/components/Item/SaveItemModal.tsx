import _SaveItemModal from 'components/modals/SaveItemModal';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';

const SaveItemModal = () => {
  const { group, clearGroup } = useGroupsStore((state) => ({
    group: state.group,
    clearGroup: () => state.setGroup(null),
  }));
  const { item, add, edit } = useItemsStore((state) => ({ item: state.item, add: state.add, edit: state.edit }));

  return (
    <_SaveItemModal
      modalKey={constants.modals.saveItem}
      item={item}
      onSave={async (data) => {
        if (group) {
          await add(group!.id, data);
        } else {
          await edit(item!.id, data);
        }

        if (group) clearGroup();
      }}
    />
  );
};

export default SaveItemModal;
