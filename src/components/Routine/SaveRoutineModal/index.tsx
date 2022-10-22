import { useMemo } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import Recurrence from 'components/Routine/SaveRoutineModal/Recurrence';

import colors from 'data/colors';
import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Omit<Routine, 'id' | 'itemIds' | 'minimized' | 'createdAt'>;

const SaveRoutineModal = () => {
  const defaultRecurrence: Routine['recurrence'] = useMemo(() => {
    return {
      startAt: dayjs().startOf('day').valueOf(),
      interval: 1,
      frequency: 'DAILY',
      days: [],
    };
  }, []);

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
      recurrence: routine?.recurrence || defaultRecurrence,
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

          <Recurrence
            value={formik.values.recurrence}
            onChange={(recurrence) => formik.setFieldValue('recurrence', recurrence)}
            isDisabled={formik.isSubmitting}
            showNext
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
