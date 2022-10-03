import { useState } from 'react';
import clsx from 'clsx';

type DeleteButtonProps = {
  className?: string | ((isClicked: boolean) => string);
  text?: React.ReactNode;
  confirmText?: React.ReactNode;
  timeout?: number;
  onConfirm: () => void;
};

const DeleteButton = ({
  className = 'px-3 py-2',
  text = 'Delete',
  confirmText = 'Confirm',
  timeout = 2000,
  onConfirm,
}: DeleteButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  return !isClicked ? (
    <button
      className={clsx(
        'rounded-md text-left hover:bg-neutral-100',
        typeof className === 'function' ? className(false) : className,
      )}
      onClick={() => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), timeout);
      }}
      data-testid="delete-button"
    >
      {text}
    </button>
  ) : (
    <button
      className={clsx(
        'rounded-md text-left text-red-500 hover:bg-red-50',
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
