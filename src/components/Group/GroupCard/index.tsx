import { useCallback, useMemo } from 'react';
import { EllipsisHorizontalIcon, PlusIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Card from 'components/Card';
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
  const clearItem = useItemsStore((state) => () => state.item && state.setItem(null));
  const saveItemModal = useModal(constants.modals.saveItem);
  const settingsModal = useModal(constants.modals.groupSettings);

  const search = useSearch(constants.searches.items);
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
    <Card
      title={group.title}
      color={group.color}
      actions={[
        {
          children: <PlusIcon className="h-5 w-5" />,
          onClick: () => {
            setGroup(group);
            clearItem();
            saveItemModal.show();
          },
          testId: 'group-card-add-item',
        },
        {
          children: <EllipsisHorizontalIcon className="h-5 w-5" />,
          onClick: () => {
            setGroup(group);
            settingsModal.show();
          },
          testId: 'group-card-settings',
        },
        {
          children: <ChevronUpIcon className={clsx('h-5 w-5', group.minimized && 'rotate-180')} />,
          onClick: () => edit(group.id, { minimized: !group.minimized }),
          testId: 'group-card-minimize',
        },
      ]}
      data-testid="group-card"
    >
      {!group.minimized && <ItemList group={group} />}
    </Card>
  );
};

export default GroupCard;
