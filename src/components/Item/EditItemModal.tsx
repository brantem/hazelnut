import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import Button from 'components/Button';

import { Item } from 'types/item';
import { useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Pick<Item, 'title'>;

const EditItemModal = () => {
  const { item, edit } = useItemsStore((state) => ({ item: state.item, edit: state.edit }));
  const editModal = useModal(constants.modals.editItem);

  const formik = useFormik<Values>({
    initialValues: { title: item?.title || '' },
    onSubmit: async (values, { resetForm }) => {
      await edit(item!.id, { title: values.title.trim() });
      resetForm();
      editModal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet isOpen={editModal.isOpen} onClose={editModal.hide} title="Edit Item" data-testid="edit-item-modal">
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
          <Button type="submit" size="lg" className="w-full" disabled={!formik.dirty || formik.isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default EditItemModal;
