import SettingsModal from 'components/modals/SettingsModal';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const HistoryItemsSettingsModal = () => {
  const history = useHistoriesStore((state) => state.history);
  const modal = useModal(constants.modals.historyItemsSetttings);
  const addExistingItemsModal = useModal(constants.modals.addExistingItemsToHistory);
  const addRawItemModal = useModal(constants.modals.addRawItemToHistory);

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
      modalKey={constants.modals.historyItemsSetttings}
      actions={[
        {
          children: 'Edit',
          onClick: () => {
            modal.hide();
            addExistingItemsModal.show();
          },
        },
        {
          children: 'Add New Item',
          onClick: () => {
            modal.hide();
            addRawItemModal.show();
          },
        },
      ]}
      data-testid="history-settings-modal"
    />
  );
};

export default HistoryItemsSettingsModal;
