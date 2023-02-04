import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';
import { ItemType } from 'types/item';

const ItemSettingsModal = () => {
  const modal = useModal(constants.modals.itemSettings);
  const saveModal = useModal(constants.modals.saveItem);
  const { item, remove } = useItemsStore((state) => ({
    item: state.item,
    remove: () => {
      state.remove(state.item!.id);
      modal.hide();
    },
  }));

  return (
    <SettingsModal
      title={item?.title}
      description={item?.type === ItemType.Number && `Min Completed: ${item.settings.minCompleted}`}
      modalKey={constants.modals.itemSettings}
      actions={[
        {
          children: 'Edit',
          onClick: () => {
            modal.hide();
            saveModal.show();
          },
        },
        {
          render: () => <DeleteButton onConfirm={remove} />,
        },
      ]}
      data-testid="item-settings-modal"
    />
  );
};

export default ItemSettingsModal;
