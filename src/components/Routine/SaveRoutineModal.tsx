import { useMemo } from 'react';
import { useFormik } from 'formik';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import DayPicker from 'components/DayPicker';

import colors from 'data/colors';
import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';

type Values = Omit<Routine, 'id'>;

type SaveRoutineModalProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  routineId: string | null;
  onSubmit: (values: Values) => void;
};

const SaveRoutineModal = ({ isOpen, onClose, routineId, onSubmit }: SaveRoutineModalProps) => {
  const { routines } = useRoutinesStore();
  const routine = useMemo(() => {
    if (!routineId) return null;
    return routines.find((routine) => routine.id === routineId);
  }, [routines, routineId]);

  const formik = useFormik<Values>({
    initialValues: {
      title: routine?.title || '',
      color: routine?.color || colors[routines.length % colors.length],
      days: routine?.days || [],
      time: routine?.time || '',
    },
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${routineId ? 'Edit' : 'Add'} Routine`}
      data-testid="save-routine-modal"
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 py-3 space-y-6">
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
            className="rounded-md bg-black py-3 px-4 text-white enabled:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 w-full disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {routineId ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveRoutineModal;
