import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const HistorySettingsModal = () => {
  const modal = useModal(constants.modals.historySettings);
  const { history, remove } = useHistoriesStore((state) => ({ history: state.history, remove: state.remove }));

  return (
    <SettingsModal
      title={history?.title}
      description={
        <>
          <span>{history?.time ? history.time : 'All day'}</span>
          <span>
            {history?.items.filter((item) => item.completedAt).length}/{history?.items.length} Item(s)
          </span>
        </>
      }
      modalKey={constants.modals.historySettings}
      actions={[
        {
          render: () => (
            <DeleteButton
              onConfirm={() => {
                remove(history!.id, history!.date);
                modal.hide();
              }}
            />
          ),
        },
      ]}
      data-testid="history-settings-modal"
    />
  );
};

export default HistorySettingsModal;
