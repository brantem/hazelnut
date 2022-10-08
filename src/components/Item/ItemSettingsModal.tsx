import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useModalStore, useItemsStore } from 'lib/stores';
import { modals } from 'data/constants';

const ItemSettingsModal = () => {
  const { hide } = useModalStore(modals.itemSettings);
  const { item, showEdit, remove } = useItemsStore((state) => ({
    item: state.item,
    showEdit: state.showEdit,
    remove: state.remove,
  }));

  return (
    <SettingsModal
      title={item?.title}
      modalKey={modals.itemSettings}
      actions={[
        { text: 'Edit', onClick: () => item && showEdit(item) },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(item!.id);
                hide();
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
