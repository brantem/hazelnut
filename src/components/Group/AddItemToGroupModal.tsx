import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import Button from 'components/Button';

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
          <Button type="submit" className="w-full" size="lg" disabled={!formik.dirty || formik.isSubmitting}>
            Add
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default AddItemToGroupModal;
