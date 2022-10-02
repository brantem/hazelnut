import { useState } from 'react';

import { useGroupsStore } from 'lib/stores';

type DeleteButtonProps = {
  groupId: string;
  onClick: () => void;
};

const DeleteButton = ({ groupId, onClick }: DeleteButtonProps) => {
  const { remove } = useGroupsStore();

  const [isDelete, setIsDelete] = useState(false);

  return !isDelete ? (
    <button
      className="rounded-md p-3 text-left hover:bg-neutral-100"
      onClick={() => {
        setIsDelete(true);
        setTimeout(() => setIsDelete(false), 2000);
      }}
    >
      Delete
    </button>
  ) : (
    <button
      className="rounded-md p-3 text-left text-red-500 hover:bg-red-50"
      onClick={() => {
        remove(groupId);
        onClick();
      }}
    >
      Click to Confirm
    </button>
  );
};

export default DeleteButton;
