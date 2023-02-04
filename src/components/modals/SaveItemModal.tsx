import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import Select from 'components/Select';
import Button from 'components/Button';

import { Item, ItemType } from 'types/item';
import { useModal } from 'lib/hooks';

type Values = Pick<Item, 'title' | 'type' | 'settings'>;

type SaveItemModalProps = {
  modalKey: string;
  item?: Item | null;
  onSave: (data: Pick<Item, 'title' | 'type' | 'settings'>) => void;
};

const SaveItemModal = ({ modalKey, item, onSave }: SaveItemModalProps) => {
  const saveModal = useModal(modalKey);

  const formik = useFormik<Values>({
    initialValues: {
      title: item?.title || '',
      type: item?.type || ItemType.Bool,
      settings: item?.settings || {},
    },
    onSubmit: async (values, { resetForm }) => {
      onSave({
        title: values.title.trim(),
        type: values.type,
        settings: values.settings,
      });

      resetForm();
      saveModal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={saveModal.isOpen}
      onClose={saveModal.hide}
      title={`${item ? 'Edit' : 'Add'} Item`}
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
                    formik.setFieldValue('settings', { minCompleted: 0, step: 1 });
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
                  label="Step"
                  name="settings.step"
                  value={formik.values.settings!.step}
                  onChange={(e) => formik.setFieldValue('settings.step', parseInt(e.target.value))}
                  disabled={formik.isSubmitting}
                  required
                  min={1}
                />

                <Input
                  type="number"
                  label="Min Completed"
                  name="settings.minCompleted"
                  value={formik.values.settings!.minCompleted}
                  onChange={(e) => formik.setFieldValue('settings.minCompleted', parseInt(e.target.value))}
                  disabled={formik.isSubmitting}
                  required
                  min={0}
                />
              </>
            )}
          </div>
        </div>

        <div className="bg-neutral-50 px-4 py-3 dark:bg-neutral-900/50">
          <Button type="submit" size="lg" className="w-full" disabled={!formik.dirty || formik.isSubmitting}>
            {item ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveItemModal;
