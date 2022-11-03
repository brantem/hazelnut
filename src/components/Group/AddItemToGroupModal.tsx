import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';

import { Item } from 'types/item';
import { useGroupsStore, useItemsStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import { modals } from 'data/constants';

type Values = Pick<Item, 'title'>;

const AddItemToGroupModal = () => {
  const group = useGroupsStore((state) => state.group);
  const add = useItemsStore((state) => state.add);
  const modal = useModal(modals.addItemToGroup);

  const formik = useFormik<Values>({
    initialValues: { title: '' },
    onSubmit: async (values, { resetForm }) => {
      await add(group!.id, { title: values.title.trim() });
      resetForm();
      modal.hide();
    },
  });

  return (
    <BottomSheet isOpen={modal.isOpen} onClose={modal.hide} title="Add Item" data-testid="add-item-modal">
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
            Add
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default AddItemToGroupModal;
