import { useState } from 'react';
import type { NextPage } from 'next';

import Layout from 'components/Layout';
import GroupCard from 'components/Group/GroupCard';
import SaveGroupModal from 'components/Group/SaveGroupModal';
import AddItemModal from 'components/Item/AddItemModal';
import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore } from 'lib/stores';

const Stuff: NextPage = () => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isGroupItemOpen, setIsGroupItemOpen] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);
  const { groups, add, edit } = useGroupsStore();

  const [groupId, setGroupId] = useState<string | null>(null);

  return (
    <>
      <Layout header={{ action: { text: 'Add Group', onClick: () => setIsGroupOpen(true) } }}>
        <section className="space-y-3">
          {groups.map((group, i) => (
            <GroupCard
              key={i}
              group={group}
              onAddItemClick={() => {
                setGroupId(group.id);
                setIsGroupItemOpen(true);
              }}
              onSettingsClick={() => {
                setGroupId(group.id);
                setIsGroupSettingsOpen(true);
              }}
            />
          ))}
        </section>
      </Layout>

      <SaveGroupModal
        isOpen={isGroupOpen}
        onClose={() => {
          if (groupId) setGroupId(null);
          setIsGroupOpen(false);
          if (isGroupSettingsOpen) setIsGroupSettingsOpen(false);
        }}
        groupId={groupId}
        onSubmit={(group) => {
          if (groupId) {
            edit(groupId, group);
          } else {
            add(group);
          }
        }}
      />

      <AddItemModal
        groupId={groupId!}
        isOpen={isGroupItemOpen}
        onClose={() => {
          setIsGroupItemOpen(false);
          setGroupId(null);
        }}
      />

      <GroupSettingsModal
        isOpen={isGroupSettingsOpen}
        onClose={() => {
          setIsGroupSettingsOpen(false);
          setGroupId(null);
        }}
        groupId={groupId!}
        onEditClick={() => setIsGroupOpen(true)}
      />
    </>
  );
};

export default Stuff;
