import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';

export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  title?: React.ReactNode;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
};

const BottomSheet = ({ isOpen, onClose, onAfterClose, title, rightElement, children, ...props }: BottomSheetProps) => {
  return (
    <Transition show={isOpen} as={Fragment} afterLeave={onAfterClose}>
      <Dialog onClose={onClose} className="relative inset-0" data-testid="bottom-sheet" {...props}>
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
          as={Fragment}
        >
          <Dialog.Backdrop
            className="fixed inset-0 z-20 bg-neutral-500/50 dark:bg-black/50"
            data-testid="bottom-sheet-backdrop"
          />
        </Transition.Child>

        <div className="fixed inset-0 z-30 flex items-end justify-center">
          <div className="flex h-full w-full max-w-lg items-end">
            <Transition.Child
              enter="transition duration-200 ease-out"
              enterFrom="transform translate-y-full"
              enterTo="transform translate-y-0"
              leave="transition duration-200 ease-out"
              leaveFrom="transform translate-y-0"
              leaveTo="transform translate-y-full"
              as={Fragment}
            >
              <Dialog.Panel className="flex w-full max-w-lg flex-col overflow-hidden rounded-t-md bg-white dark:bg-neutral-800">
                <div className="flex items-center justify-between px-4 py-3">
                  {title && <Dialog.Title className="text-lg font-semibold dark:text-white">{title}</Dialog.Title>}
                  {rightElement}
                </div>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BottomSheet;
