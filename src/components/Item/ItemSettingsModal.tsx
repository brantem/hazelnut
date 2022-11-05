import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const ItemSettingsModal = () => {
  const modal = useModal(constants.modals.itemSettings);
  const saveModal = useModal(constants.modals.saveItem);
  const { item, remove } = useItemsStore((state) => ({ item: state.item, remove: state.remove }));

  return (
    <SettingsModal
      title={item?.title}
      modalKey={constants.modals.itemSettings}
      actions={[
        {
          children: 'Edit',
          onClick: () => saveModal.show(),
        },
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
