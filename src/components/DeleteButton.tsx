import { useState } from 'react';

type DeleteButtonProps = {
  className?: string | ((clicked: boolean) => string);
  text?: React.ReactNode;
  confirmText?: React.ReactNode;
  timeout?: number;
  onConfirm: () => void;
};

const DeleteButton = ({
  className,
  text = 'Delete',
  confirmText = 'Confirm',
  timeout = 2000,
  onConfirm,
}: DeleteButtonProps) => {
  const [clicked, setClicked] = useState(false);

  return !clicked ? (
    <button
      className={
        (typeof className === 'function' ? className(false) : className) ||
        'rounded-md text-left hover:bg-neutral-100 px-3 py-2'
      }
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
      className={
        (typeof className === 'function' ? className(true) : className) ||
        'rounded-md text-left text-red-500 hover:bg-red-50 px-3 py-2'
      }
      onClick={onConfirm}
      data-testid="delete-button-confirm"
    >
      {confirmText}
    </button>
  );
};

export default DeleteButton;
