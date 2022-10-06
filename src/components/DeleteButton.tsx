import { useState } from 'react';
import clsx from 'clsx';

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
      className={clsx(
        'px-4 py-2 text-left hover:bg-neutral-100',
        typeof className === 'function' ? className(false) : className,
      )}
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
      className={clsx(
        'px-4 py-2 text-left text-red-500 hover:bg-red-50',
        typeof className === 'function' ? className(true) : className,
      )}
      onClick={onConfirm}
      data-testid="delete-button-confirm"
    >
      {confirmText}
    </button>
  );
};

export default DeleteButton;
