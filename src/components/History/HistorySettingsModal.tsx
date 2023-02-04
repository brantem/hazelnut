import SettingsModal from 'components/modals/SettingsModal';
import DeleteButton from 'components/DeleteButton';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

const HistorySettingsModal = () => {
  const modal = useModal(constants.modals.historySettings);
  const saveNoteModal = useModal(constants.modals.saveHistoryNote);
  const { history, remove } = useHistoriesStore((state) => ({
    history: state.history,
    remove: () => {
      state.remove(state.history!.id, state.history!.date);
      modal.hide();
    },
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
          children: history?.note ? 'Edit Note' : 'Add Note',
          onClick: () => {
            modal.hide();
            saveNoteModal.show();
          },
        },
        {
          render: () => <DeleteButton onConfirm={remove} />,
        },
      ]}
      data-testid="history-settings-modal"
    />
  );
};

export default HistorySettingsModal;
