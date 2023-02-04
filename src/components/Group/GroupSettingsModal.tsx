import { useCallback } from 'react';

import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore, useItemsStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import * as constants from 'data/constants';

const GroupSettingsModal = () => {
  const modal = useModal(constants.modals.groupSettings);
  const saveModal = useModal(constants.modals.saveGroup);
  const { group, remove } = useGroupsStore((state) => ({
    group: state.group,
    remove: () => {
      state.remove(state.group!.id);
      modal.hide();
    },
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
            modal.hide();
            saveModal.show();
          },
        },
        {
          render: () => <DeleteButton onConfirm={remove} />,
        },
      ]}
      data-testid="group-settings-modal"
    />
  );
};

export default GroupSettingsModal;
