import { useFormik } from 'formik';

import BottomSheet, { BottomSheetProps } from 'components/BottomSheet';
import Input from 'components/Input';

import { GroupItem } from 'types/group';

type Values = Pick<GroupItem, 'title'>;

type AddGroupItemModalProps = Pick<BottomSheetProps, 'isOpen' | 'onClose'> & {
  onSubmit: (values: Values) => void;
};

const AddGroupItemModal = ({ isOpen, onClose, onSubmit }: AddGroupItemModalProps) => {
  const formik = useFormik<Values>({
    initialValues: { title: '' },
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
      onClose();
    },
  });

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Item" data-testid="add-group-item-modal">
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          required
        />

        <div className="bg-neutral-50 px-4 py-3">
          <button
            type="submit"
            className="rounded-md bg-black py-3 px-4 text-white enabled:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 w-full disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            Add
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default AddGroupItemModal;
