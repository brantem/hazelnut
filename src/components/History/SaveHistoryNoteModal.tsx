import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Textarea from 'components/Textarea';
import Button from 'components/Button';

import { useModal } from 'lib/hooks';
import { useHistoriesStore } from 'lib/stores';
import * as constants from 'data/constants';

type Values = {
  note: string;
};

const SaveHistoryModal = () => {
  const modal = useModal(constants.modals.historyNote);
  const { history, saveNote } = useHistoriesStore((state) => ({ history: state.history, saveNote: state.saveNote }));

  const formik = useFormik<Values>({
    initialValues: { note: history?.note || '' },
    onSubmit: async (values, { resetForm }) => {
      saveNote(history!.id, history!.date, values.note.trim());
      resetForm();
      modal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      title={history?.title}
      data-testid="save-history-note-modal"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6 px-4 pb-3">
          <Textarea
            label="Note"
            name="note"
            value={formik.values.note}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            className="h-[50vh]"
          />
        </div>

        <div className="bg-neutral-50 px-4 py-3">
          <Button type="submit" size="lg" className="w-full" disabled={!formik.dirty || formik.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveHistoryModal;
