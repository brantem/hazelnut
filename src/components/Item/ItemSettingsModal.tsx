import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const ItemSettingsModal = () => {
  const modal = useModal(constants.modals.itemSettings);
  const editModal = useModal(constants.modals.editItem);
  const { item, remove } = useItemsStore((state) => ({ item: state.item, remove: state.remove }));

  return (
    <SettingsModal
      title={item?.title}
      modalKey={constants.modals.itemSettings}
      actions={[
        { text: 'Edit', onClick: () => editModal.show() },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(item!.id);
                modal.hide();
              }}
            />
          ),
        },
      ]}
      data-testid="item-settings-modal"
    />
  );
};

export default ItemSettingsModal;
