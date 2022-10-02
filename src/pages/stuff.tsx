import { useState } from 'react';
import type { NextPage } from 'next';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import SaveGroupModal from 'components/SaveGroupModal';
import GroupSettingsModal from 'components/GroupSettingsModal';

import { Group } from 'types/group';
import { useGroupsStore } from 'lib/stores';

type GroupProps = {
  group: Group;
  onSettingsClick: () => void;
};

const Group = ({ group, onSettingsClick }: GroupProps) => {
  return (
    <div className={`px-4 py-3 bg-${group.color}-50`}>
      <div className="flex justify-between items-center space-x-3">
        <h3 className={`uppercase text-sm font-semibold text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button className={`px-2 py-1 text-sm rounded-md hover:bg-${group.color}-100 flex-shrink-0`}>Add Item</button>

          <button className={`p-1 rounded-md hover:bg-${group.color}-100`} onClick={onSettingsClick}>
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ol className="space-y-1 py-1">
        {group.items.map((item, j) => (
          <li key={j}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

const Stuff: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { groups, add, edit } = useGroupsStore();

  const [groupId, setGroupId] = useState<string | null>(null);

  return (
    <>
      <Layout header={{ action: { text: 'Add Group', onClick: () => setIsOpen(true) } }}>
        <section className="space-y-3">
          {groups.map((group, i) => (
            <Group key={i} group={group} onSettingsClick={() => setGroupId(group.id)} />
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
