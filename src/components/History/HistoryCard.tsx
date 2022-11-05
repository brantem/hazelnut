import { useReducer } from 'react';
import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Card from 'components/Card';
import Checkbox from 'components/Checkbox';

import { useHistoriesStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import type { History } from 'types/history';
import * as constants from 'data/constants';

type ItemListProps = {
  history: History;
};

const ItemList = ({ history }: ItemListProps) => {
  const save = useHistoriesStore((state) => state.save);

  return (
    <ol className="space-y-1 pt-1" data-testid="history-card-items">
      {history.items.map((item) => (
        <li key={history.id + '-' + item.id} className="flex h-8 w-full items-center justify-between space-x-2 pr-1">
          <div className="w-full">
            <Checkbox
              label={item.title}
              name={history.id + '-' + item.id}
              color={history.color}
              checked={!!item.completedAt}
              onChange={(e) => save(history, item, e.target.checked)}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

type HistoryProps = {
  history: History;
};

const HistoryCard = ({ history }: HistoryProps) => {
  const setHistory = useHistoriesStore((state) => state.setHistory);
  const addItemsModal = useModal(constants.modals.addItemsToHistory);
  const settingsModal = useModal(constants.modals.historySettings);

  const [minimized, toggleMinimized] = useReducer((prev) => !prev, false);

  return (
    <Card
      color={history.color}
      title={
        <>
          <span>{history.title}</span>
          {history.time && (
            <span className={`text-sm font-medium text-${history.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
              {history.time}
            </span>
          )}
        </>
      }
      actions={[
        {
          children: 'Items',
          onClick: () => {
            setHistory(history);
            addItemsModal.show();
          },
          testId: 'history-card-add-items',
        },
        {
          children: <EllipsisHorizontalIcon className="h-5 w-5" />,
          onClick: () => {
            setHistory(history);
            settingsModal.show();
          },
          testId: 'history-card-settings',
        },
        {
          children: <ChevronUpIcon className={clsx('h-5 w-5', minimized && 'rotate-180')} />,
          onClick: toggleMinimized,
          testId: 'history-card-minimize',
        },
      ]}
      data-testid="history-card"
    >
      {!minimized && <ItemList history={history} />}
    </Card>
  );
};

export default HistoryCard;
