import { useState } from 'react';
import type { NextPage } from 'next';

import Layout from 'components/Layout';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore } from 'lib/stores';

const Stuff: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { groups, add, edit } = useGroupsStore();

  const [groupId, setGroupId] = useState<string | null>(null);

  return (
    <>
      <Layout header={{ action: { text: 'Add Group', onClick: () => setIsOpen(true) } }}>
        <section className="space-y-3">
          {groups.map((group, i) => (
            <GroupCard key={i} group={group} onSettingsClick={() => setGroupId(group.id)} />
          ))}
        </section>
      </Layout>

      <SaveGroupModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        groupId={groupId}
        onSubmit={(group) => {
          if (groupId) {
            edit(groupId, group);
            setGroupId(null);
          } else {
            add(group);
          }
        }}
      />

      <GroupSettingsModal
        isOpen={!!groupId}
        onClose={() => setGroupId(null)}
        groupId={groupId!}
        onEditClick={() => setIsOpen(true)}
      />
    </>
  );
};

export default Stuff;
