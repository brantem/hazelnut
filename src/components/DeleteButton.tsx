import { useState } from 'react';

type DeleteButtonProps = {
  text?: React.ReactNode;
  confirmText?: React.ReactNode;
  timeout?: number;
  onConfirm: () => void;
};

const DeleteButton = ({ text = 'Delete', confirmText = 'Confirm', timeout = 2000, onConfirm }: DeleteButtonProps) => {
  const [clicked, setClicked] = useState(false);

  return !clicked ? (
    <button
      className="px-4 py-2 text-left text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), timeout);
      }}
      data-testid="delete-button"
    >
      {text}
    </button>
  ) : (
    <button
      className="px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      onClick={onConfirm}
      data-testid="delete-button-confirm"
    >
      {confirmText}
    </button>
  );
};

export default DeleteButton;
