import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import Button from 'components/Button';

import colors from 'data/colors';
import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';
import * as constants from 'data/constants';
import { useModal } from 'lib/hooks';

type Values = Pick<Group, 'title' | 'color'>;

const SaveGroupModal = () => {
  const modal = useModal(constants.modals.saveGroup);
  const { defaultColor, group, add, edit } = useGroupsStore((state) => ({
    defaultColor: colors[state.groups.length % colors.length],
    group: state.group,
    add: state.add,
    edit: state.edit,
  }));

  const formik = useFormik<Values>({
    initialValues: {
      title: group?.title || '',
      color: group?.color || defaultColor,
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        title: values.title.trim(),
        color: values.color,
      };

      if (group) {
        edit(group.id, data);
      } else {
        add(data);
      }

      resetForm();
      modal.hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      title={`${group ? 'Edit' : 'Add'} Group`}
      data-testid="save-group-modal"
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
          <ColorPicker
            value={formik.values.color}
            onChange={(color: string) => formik.setFieldValue('color', color)}
            isDisabled={formik.isSubmitting}
          />
        </div>

        <div className="bg-neutral-50 px-4 py-3">
          <Button type="submit" className="w-full" size="lg" disabled={!formik.dirty || formik.isSubmitting}>
            {group ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveGroupModal;
