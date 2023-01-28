import { Fragment } from 'react';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';

import { useModal } from 'lib/hooks';

type Action = { skip?: boolean } & (
  | { children: React.ReactNode; onClick: () => void }
  | { render: () => React.ReactNode }
);

type SettingsModalProps = Pick<BottomSheetProps, 'title'> & {
  modalKey: string;
  description?: React.ReactNode;
  actions: Action[];
};

const SettingsModal = ({ modalKey, description, actions, ...props }: SettingsModalProps) => {
  const modal = useModal(modalKey);

  return (
    <BottomSheet data-testid="settings-modal" {...props} isOpen={modal.isOpen} onClose={modal.hide}>
      {description && (
        <div className="-mt-2 mb-3 flex items-center justify-between space-x-3 px-4 text-base font-normal text-neutral-500">
          {description}
        </div>
      )}

      <div className="flex flex-col pb-3">
        {actions.map((action, i) => {
          if (action.skip) return null;
          return 'render' in action ? (
            <Fragment key={i}>{action.render()}</Fragment>
          ) : (
            <button
              key={i}
              className="px-4 py-2 text-left hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
              onClick={action.onClick}
            >
              {action.children}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
};

export default SettingsModal;
