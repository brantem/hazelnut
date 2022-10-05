import { useFormik } from 'formik';

import BottomSheet from 'components/BottomSheet';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';

import colors from 'data/colors';
import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

type Values = Pick<Group, 'title' | 'color'>;

const SaveGroupModal = () => {
  const { groups, group, isSaveOpen, hide, resetAfterHide, add, edit } = useGroupsStore();

  const formik = useFormik<Values>({
    initialValues: {
      title: group?.title || '',
      color: group?.color || colors[groups.length % colors.length],
    },
    onSubmit: async (values, { resetForm }) => {
      if (group) {
        edit(group.id, values);
      } else {
        add(values);
      }

      resetForm();
      hide();
    },
    enableReinitialize: true,
  });

  return (
    <BottomSheet
      isOpen={isSaveOpen}
      onClose={hide}
      title={`${group ? 'Edit' : 'Add'} Group`}
      data-testid="save-group-modal"
      afterLeave={resetAfterHide}
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
          <button
            type="submit"
            className="w-full rounded-md bg-black py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {group ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
};

export default SaveGroupModal;
