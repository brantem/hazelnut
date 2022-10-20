import { useReducer } from 'react';
import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

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
    <ol className="space-y-1 pt-2 pb-1" data-testid="history-card-items">
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
  const settingsModal = useModal(constants.modals.historySettings);

  const [minimized, toggleMinimized] = useReducer((prev) => !prev, false);

  return (
    <div className={`px-4 py-3 bg-${history.color}-50`} data-testid="history-card">
      <div className="flex h-8 items-center justify-between space-x-3">
        <div className="flex max-w-[440px] items-center space-x-3">
          <h3 className={`text-sm font-semibold uppercase text-${history.color}-600 truncate`}>{history.title} </h3>
          {history.time && (
            <span className={`text-sm font-medium text-${history.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
              {history.time}
            </span>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center space-x-2">
          <button
            className={`rounded-md p-1 hover:bg-${history.color}-100`}
            onClick={() => {
              setHistory(history);
              settingsModal.show();
            }}
            data-testid="history-card-settings"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>

          <button
            className={clsx(`rounded-md p-1 hover:bg-${history.color}-100`, minimized && 'rotate-180')}
            onClick={toggleMinimized}
            data-testid="history-card-minimize"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!minimized && <ItemList history={history} />}
    </div>
  );
};

export default HistoryCard;
