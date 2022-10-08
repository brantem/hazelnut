import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';

import colors from 'data/colors';
import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';

type Values = Pick<Routine, 'title' | 'color' | 'time'>;

const DuplicateRoutineModal = () => {
  const { routines, routine, isDuplicateOpen, hide, resetAfterHide, add } = useRoutinesStore();

  const formik = useFormik<Values>({
    initialValues: {
      title: (routine?.title || '') + ' - Copy',
      color: colors[routines.length % colors.length],
      time: routine?.time || '',
    },
    onSubmit: async (values, { resetForm }) => {
      add({
        title: values.title,
        color: values.color,
        days: routine!.days,
        time: values.time,
        itemIds: routine!.itemIds,
      });

      resetForm();
      hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={isDuplicateOpen}
      onClose={hide}
      title="Duplicate Routine"
      data-testid="duplicate-routine-modal"
      afterLeave={resetAfterHide}
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

          <Input
            label="Time"
            name="time"
            type="time"
            required
            value={formik.values.time}
            onChange={formik.handleChange}
          />
        </div>

        <div className="bg-neutral-50 px-4 py-3">
          <button
            type="submit"
            className="w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
            disabled={formik.isSubmitting}
          >
            Duplicate
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default DuplicateRoutineModal;
