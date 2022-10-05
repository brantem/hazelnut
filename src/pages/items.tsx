import type { NextPage } from 'next';

import Layout from 'components/Layout';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import AddItemToGroupModal from 'components/Item/AddItemToGroupModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore } from 'lib/stores';

const Items: NextPage = () => {
  const { groups, showSave } = useGroupsStore();

  return (
    <>
      <Layout header={{ actions: [{ text: 'Add Group', onClick: () => showSave() }] }}>
        <section className="space-y-3">
          {groups.map((group, i) => (
            <GroupCard key={i} group={group} />
          ))}
        </section>
      </Layout>

      <SaveGroupModal />

      <AddItemToGroupModal />

      <GroupSettingsModal />
    </>
  );
};

export default Items;
