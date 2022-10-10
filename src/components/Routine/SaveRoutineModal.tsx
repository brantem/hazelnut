import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import DayPicker from 'components/DayPicker';

import colors from 'data/colors';
import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Omit<Routine, 'id' | 'itemIds' | 'minimized'>;

const SaveRoutineModal = () => {
  const modal = useModal(constants.modals.saveRoutine);
  const { defaultColor, routine, add, edit } = useRoutinesStore((state) => ({
    defaultColor: colors[state.routines.length % colors.length],
    routine: state.routine,
    add: state.add,
    edit: state.edit,
  }));

  const formik = useFormik<Values>({
    initialValues: {
      title: routine?.title || '',
      color: routine?.color || defaultColor,
      days: routine?.days || [],
      time: routine?.time || '',
    },
    onSubmit: async (values, { resetForm }) => {
      if (routine) {
        edit(routine?.id, values);
      } else {
        add(values);
      }

      resetForm();
      modal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      title={`${routine ? 'Edit' : 'Add'} Routine`}
      data-testid="save-routine-modal"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-6 px-4 pb-3">
          <Input
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            required
          />

          <ColorPicker
            value={formik.values.color}
            onChange={(color: string) => formik.setFieldValue('color', color)}
            isDisabled={formik.isSubmitting}
          />

          <DayPicker
            value={formik.values.days}
            onChange={(days: string[]) => formik.setFieldValue('days', days)}
            isDisabled={formik.isSubmitting}
          />

          <Input label="Time" name="time" type="time" value={formik.values.time || ''} onChange={formik.handleChange} />
        </div>

        <div className="bg-neutral-50 px-4 py-3">
          <button
            type="submit"
            className="w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {routine ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveRoutineModal;
