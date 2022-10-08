import { useCallback } from 'react';

import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useModalStore, useGroupsStore, useItemsStore } from 'lib/stores';
import { modals } from 'data/constants';

const GroupSettingsModal = () => {
  const { hide } = useModalStore(modals.groupSettings);
  const { group, showSave, remove } = useGroupsStore((state) => ({
    group: state.group,
    showSave: state.showSave,
    remove: state.remove,
  }));
  const itemsLength = useItemsStore(
    useCallback(
      (state) => {
        if (!group?.id) return 0;
        return state.getItemsByGroupId(group.id).length;
      },
      [group?.id],
    ),
  );

  return (
    <SettingsModal
      title={group?.title}
      description={`${itemsLength} Item(s)`}
      modalKey={modals.groupSettings}
      actions={[
        { text: 'Edit', onClick: () => showSave(group) },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(group!.id);
                hide();
              }}
            />
          ),
        },
      ]}
      data-testid="group-settings-modal"
    />
  );
};

export default GroupSettingsModal;
