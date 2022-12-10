import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const HistorySettingsModal = () => {
  const modal = useModal(constants.modals.historySettings);
  const historyNoteModal = useModal(constants.modals.historyNote);
  const { history, setHistory, remove } = useHistoriesStore((state) => ({
    history: state.history,
    setHistory: state.setHistory,
    remove: state.remove,
  }));

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
          children: 'Add Note',
          onClick: () => {
            setHistory(history);
            historyNoteModal.show();
          },
          skip: !!history?.note,
        },
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
