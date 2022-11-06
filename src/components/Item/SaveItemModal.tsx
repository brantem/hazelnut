import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import Select from 'components/Select';
import Button from 'components/Button';

import { Item, ItemType } from 'types/item';
import { useGroupsStore, useItemsStore } from 'lib/stores';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Pick<Item, 'title' | 'type' | 'settings'>;

const SaveItemModal = () => {
  const { group, clearGroup } = useGroupsStore((state) => ({
    group: state.group,
    clearGroup: () => state.setGroup(null),
  }));
  const { item, add, edit } = useItemsStore((state) => ({ item: state.item, add: state.add, edit: state.edit }));
  const saveModal = useModal(constants.modals.saveItem);

  const formik = useFormik<Values>({
    initialValues: {
      title: item?.title || '',
      type: item?.type || ItemType.Bool,
      settings: item?.settings || {},
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        title: values.title.trim(),
        type: values.type,
        settings: values.settings,
      };

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
        <div className="space-y-6 px-4 pb-3">
          <Input
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            required
          />

          <div className="flex items-center space-x-3">
            <Select
              label="Type"
              name="type"
              value={formik.values.type}
              onChange={(e) => {
                const type = parseInt(e.target.value);
                formik.setFieldValue('type', type);
                switch (type) {
                  case ItemType.Bool:
                    formik.setFieldValue('settings', {});
                    break;
                  case ItemType.Number:
                    formik.setFieldValue('settings', { minCompleted: 1, step: 1 });
                    break;
                }
              }}
              disabled={formik.isSubmitting}
              required
            >
              <option value={ItemType.Bool} defaultChecked>
                Checkbox
              </option>
              <option value={ItemType.Number}>Number</option>
            </Select>

            {formik.values.type === ItemType.Number && (
              <>
                <Input
                  type="number"
                  label="Min Completed"
                  name="settings.minCompleted"
                  value={formik.values.settings!.minCompleted}
                  onChange={(e) => formik.setFieldValue('settings.minCompleted', parseInt(e.target.value || '1'))}
                  disabled={formik.isSubmitting}
                  required
                  min={1}
                />

                <Input
                  type="number"
                  label="Step"
                  name="settings.step"
                  value={formik.values.settings!.step}
                  onChange={(e) => formik.setFieldValue('settings.step', parseInt(e.target.value || '1'))}
                  disabled={formik.isSubmitting}
                  required
                  min={1}
                />
              </>
            )}
          </div>
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
