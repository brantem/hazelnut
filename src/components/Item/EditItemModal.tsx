import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';

import { Item } from 'types/item';
import { useItemsStore } from 'lib/stores';

type Values = Pick<Item, 'title'>;

const EditItemModal = () => {
  const { item, isEditOpen, hide, resetAfterHide, edit } = useItemsStore();

  const formik = useFormik<Values>({
    initialValues: { title: item?.title || '' },
    onSubmit: async (values, { resetForm }) => {
      await edit(item!.id, values);
      resetForm();
      hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={isEditOpen}
      onClose={hide}
      title="Edit Item"
      data-testid="edit-item-modal"
      afterLeave={resetAfterHide}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 pb-3">
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
            className="w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-700 disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default EditItemModal;