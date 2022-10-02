import { useMemo } from 'react';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { useFormik } from 'formik';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';
import Input from 'components/Input';

import { typeColors } from 'data/colors';
import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

type Values = Pick<Group, 'title' | 'color'>;

type SaveGroupModalProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  groupId: string | null;
  onSubmit: (values: Values) => void;
};

const SaveGroupModal = ({ isOpen, onClose, groupId, onSubmit }: SaveGroupModalProps) => {
  const { groups } = useGroupsStore();
  const group = useMemo(() => {
    if (!groupId) return null;
    return groups.find((group) => group.id === groupId);
  }, [groups, groupId]);

  const formik = useFormik<Values>({
    initialValues: {
      title: group?.title || '',
      color: group?.color || typeColors[groups.length % typeColors.length],
    },
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`${groupId ? 'Edit' : 'Add'} Group`}>
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          required
        />

        <RadioGroup
          className="px-4 py-3"
          value={formik.values.color}
          onChange={(color: string) => formik.setFieldValue('color', color)}
        >
          <RadioGroup.Label className="block text-sm text-neutral-700">Color</RadioGroup.Label>

          <div className="flex justify-between space-x-3 mt-2 w-full">
            {typeColors.map((color) => (
              <RadioGroup.Option
                value={color}
                key={color}
                className={({ checked }) =>
                  clsx(
                    `h-9 w-9 rounded-full focus:outline-none ring-offset-2`,
                    checked && 'ring-2',
                    formik.isSubmitting
                      ? `bg-${color}-300 ring-neutral-300`
                      : `bg-${color}-500 ring-neutral-500 cursor-pointer`,
                  )
                }
                disabled={formik.isSubmitting}
              />
            ))}
          </div>
        </RadioGroup>

        <div className="bg-neutral-50 px-4 py-3">
          <button
            type="submit"
            className="rounded-md bg-black py-3 px-4 text-white enabled:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 w-full disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {groupId ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveGroupModal;
