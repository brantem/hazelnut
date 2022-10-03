import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';

import { Item } from 'types/item';
import { useItemsStore, useItemStore } from 'lib/stores';

type Values = Pick<Item, 'title'>;

const AddItemModal = () => {
  const { add } = useItemsStore();
  const { groupId, clear, isAddOpen, hide } = useItemStore();

  const formik = useFormik<Values>({
    initialValues: { title: '' },
    onSubmit: async (values, { resetForm }) => {
      await add(groupId!, values);
      resetForm();
      hide();
    },
  });

  return (
    <BottomSheet isOpen={isAddOpen} onClose={hide} title="Add Item" data-testid="add-item-modal" afterLeave={clear}>
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 py-3">
          <Input
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            required
          />
        </div>

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

export default AddItemModal;
