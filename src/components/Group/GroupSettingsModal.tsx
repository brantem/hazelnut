import { useCallback } from 'react';

import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import * as constants from 'data/constants';

const GroupSettingsModal = () => {
  const modal = useModal(constants.modals.groupSettings);
  const saveGroupModal = useModal(constants.modals.saveGroup);
  const { group, setGroup, remove } = useGroupsStore((state) => ({
    group: state.group,
    setGroup: state.setGroup,
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
      modalKey={constants.modals.groupSettings}
      actions={[
        {
          children: 'Edit',
          onClick: () => {
            setGroup(group);
            saveGroupModal.show();
          },
        },
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(group!.id);
                modal.hide();
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
