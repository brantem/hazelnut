import { useEffect, useState, useMemo } from 'react';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';

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

  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    if (!isDelete) return;
    setTimeout(() => {
      setIsDelete(false);
    }, 2000);
  }, [isDelete]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={group?.title}>
      <div className="px-2 pb-3 flex flex-col">
        <button className="rounded-md p-3 text-left hover:bg-neutral-100" onClick={onEditClick}>
          Edit
        </button>

        {!isDelete ? (
          <button className="rounded-md p-3 text-left hover:bg-neutral-100" onClick={() => setIsDelete(true)}>
            Delete
          </button>
        ) : (
          <button
            className="rounded-md p-3 text-left text-red-500 hover:bg-red-50"
            onClick={() => {
              remove(groupId);
              onClose();
            }}
          >
            Click to Confirm
          </button>
        )}
      </div>
    </BottomSheet>
  );
};

export default GroupSettingsModal;
