import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import Recurrence from 'components/Routine/SaveRoutineModal/Recurrence';
import Button from 'components/Button';

import colors from 'data/colors';
import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Pick<Routine, 'title' | 'color' | 'recurrence' | 'time'>;

const DuplicateRoutineModal = () => {
  const modal = useModal(constants.modals.duplicateRoutine);
  const { defaultColor, routine, add } = useRoutinesStore((state) => ({
    defaultColor: colors[state.routines.length % colors.length],
    routine: state.routine,
    add: state.add,
  }));

  const formik = useFormik<Values>({
    initialValues: {
      title: (routine?.title || '') + ' - Copy',
      color: defaultColor,
      recurrence: routine?.recurrence as Routine['recurrence'],
      time: routine?.time || null,
    },
    onSubmit: async (values, { resetForm }) => {
      add({
        title: values.title.trim(),
        color: values.color,
        recurrence: values.recurrence,
        time: values.time,
        itemIds: routine!.itemIds,
      });

      resetForm();
      modal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      title="Duplicate Routine"
      data-testid="duplicate-routine-modal"
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

          <Recurrence
            value={formik.values.recurrence}
            onChange={(recurrence) => formik.setFieldValue('recurrence', recurrence)}
            isDisabled={formik.isSubmitting}
            showNext
          />

          <Input label="Time" name="time" type="time" value={formik.values.time || ''} onChange={formik.handleChange} />
        </div>

        <div className="bg-neutral-50 px-4 py-3">
          <Button type="submit" size="lg" className="w-full" disabled={formik.isSubmitting}>
            Duplicate
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default DuplicateRoutineModal;
