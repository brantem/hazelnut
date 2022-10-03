import type { NextPage } from 'next';

import Layout from 'components/Layout';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import AddItemModal from 'components/Item/AddItemModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore, useGroupStore } from 'lib/stores';

const Stuff: NextPage = () => {
  const { groups } = useGroupsStore();
  const { showSave } = useGroupStore();

  return (
    <>
      <Layout header={{ action: { text: 'Add Group', onClick: () => showSave() } }}>
        <section className="space-y-3">
          {groups.map((group, i) => (
            <GroupCard key={i} group={group} />
          ))}
        </section>
      </Layout>

      <SaveGroupModal />

      <AddItemModal />

      <GroupSettingsModal />
    </>
  );
};

export default Stuff;
