import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import Button from 'components/Button';

import { Item } from 'types/item';
import { useGroupsStore, useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Pick<Item, 'title'>;

const SaveItemModal = () => {
  const { group, clearGroup } = useGroupsStore((state) => ({
    group: state.group,
    clearGroup: () => state.setGroup(null),
  }));
  const { item, add, edit } = useItemsStore((state) => ({ item: state.item, add: state.add, edit: state.edit }));
  const saveModal = useModal(constants.modals.saveItem);

  const formik = useFormik<Values>({
    initialValues: { title: item?.title || '' },
    onSubmit: async (values, { resetForm }) => {
      const data = { title: values.title.trim() };

      if (group) {
        await add(group!.id, data);
      } else {
        await edit(item!.id, data);
      }

      resetForm();
      saveModal.hide();
      if (group) clearGroup();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={saveModal.isOpen}
      onClose={saveModal.hide}
      title={`${group ? 'Add' : 'Edit'} Item`}
      data-testid="save-item-modal"
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
          <Button type="submit" size="lg" className="w-full" disabled={!formik.dirty || formik.isSubmitting}>
            {group ? 'Add' : 'Save'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveItemModal;
