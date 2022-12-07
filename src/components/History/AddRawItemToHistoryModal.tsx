import SaveItemModal from 'components/modals/SaveItemModal';

import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';

const AddRawItemToHistoryModal = () => {
  const { history, addRawItem } = useHistoriesStore((state) => ({
    history: state.history,
    addRawItem: state.addRawItem,
  }));

  return (
    <SaveItemModal
      modalKey={constants.modals.addRawItemToHistory}
      onSave={(data) => history && addRawItem(history.id, history.date, data)}
    />
  );
};

export default AddRawItemToHistoryModal;
