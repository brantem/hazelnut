import { useCallback, useMemo } from 'react';
import { EllipsisHorizontalIcon, PlusIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import ItemList from 'components/Group/GroupCard/ItemList';

import { isMatch } from 'lib/helpers';
import { useGroupsStore, useItemsStore } from 'lib/stores';
import type { Group } from 'types/group';
import * as constants from 'data/constants';
import { useSearch, useModal } from 'lib/hooks';

type GroupCardProps = {
  group: Group;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { setGroup, edit } = useGroupsStore((state) => ({ setGroup: state.setGroup, edit: state.edit }));
  const addItemModal = useModal(constants.modals.addItemToGroup);
  const settingsModal = useModal(constants.modals.groupSettings);

  const search = useSearch('items');
  const isGroupMatch = useMemo(() => {
    if (!search.value) return true;
    return isMatch(group.title, search.value);
  }, [group.title, search.value]);
  const isItemsMatch = useItemsStore(
    useCallback(
      (state) => {
        if (!search.value) return true;
        return state.getItemsByGroupId(group.id).findIndex((item) => isMatch(item.title, search.value)) !== -1;
      },
      [group.id, search.value],
    ),
  );

  if (!isGroupMatch && !isItemsMatch) return null;

  return (
    <div className={`px-4 py-3 bg-${group.color}-50`} data-testid="group-card">
      <div className="flex items-center justify-between space-x-3">
        <h3 className={`text-sm font-semibold uppercase text-${group.color}-600 truncate`}>{group.title}</h3>

        <div className="flex flex-shrink-0 items-center space-x-1">
          <button
            className={`rounded-md p-1 text-sm hover:bg-${group.color}-100 flex-shrink-0`}
            onClick={() => {
              setGroup(group);
              addItemModal.show();
            }}
            data-testid="group-card-add-item"
          >
            <PlusIcon className="h-5 w-5" />
          </button>

          <button
            className={`rounded-md p-1 hover:bg-${group.color}-100`}
            onClick={() => {
              setGroup(group);
              settingsModal.show();
            }}
            data-testid="group-card-settings"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>

          <button
            className={clsx(`rounded-md p-1 hover:bg-${group.color}-100`, group.minimized && 'rotate-180')}
            onClick={() => edit(group.id, { minimized: !group.minimized })}
            data-testid="group-card-minimize"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!group.minimized && <ItemList group={group} />}
    </div>
  );
};

export default GroupCard;
