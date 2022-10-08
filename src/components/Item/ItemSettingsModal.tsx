import BottomSheet from 'components/BottomSheet';
import DeleteButton from 'components/DeleteButton';

import { useItemsStore } from 'lib/stores';

const ItemSettingsModal = () => {
  const { item, showEdit, isSettingsOpen, hide, resetAfterHide, remove } = useItemsStore();

  return (
    <BottomSheet
      isOpen={isSettingsOpen}
      onClose={hide}
      title={item?.title}
      data-testid="item-settings-modal"
      afterLeave={resetAfterHide}
    >
      <div className="flex flex-col pb-3">
        <button className="px-4 py-2 text-left hover:bg-neutral-100" onClick={() => showEdit()}>
          Edit
        </button>

        <DeleteButton
          onConfirm={() => {
            remove(item!.id);
            hide();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default ItemSettingsModal;
