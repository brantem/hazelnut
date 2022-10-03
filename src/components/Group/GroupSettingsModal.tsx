import { useMemo } from 'react';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';
import DeleteButton from 'components/DeleteButton';

import { useGroupsStore } from 'lib/stores';

type GroupSettingsModal = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  groupId: string;
  onEditClick: () => void;
};

const GroupSettingsModal = ({ isOpen, onClose, groupId, onEditClick }: GroupSettingsModal) => {
  const { groups, remove } = useGroupsStore();
  const group = useMemo(() => {
    if (!groupId) return null;
    return groups.find((group) => group.id === groupId);
  }, [groups, groupId]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={group?.title} data-testid="group-settings-modal">
      <div className="px-2 pb-3 flex flex-col">
        <button className="rounded-md p-3 text-left hover:bg-neutral-100" onClick={onEditClick}>
          Edit
        </button>

        <DeleteButton
          onConfirm={() => {
            remove(groupId);
            onClose();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default GroupSettingsModal;
