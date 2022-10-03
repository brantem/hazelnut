import { useState } from 'react';

type DeleteButtonProps = {
  onConfirm: () => void;
};

const DeleteButton = ({ onConfirm }: DeleteButtonProps) => {
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
    <button className="rounded-md p-3 text-left text-red-500 hover:bg-red-50" onClick={onConfirm}>
      Click to Confirm
    </button>
  );
};

export default DeleteButton;
