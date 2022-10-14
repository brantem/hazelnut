import { useReducer } from 'react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Checkbox from 'components/Checkbox';

import { useHistoriesStore } from 'lib/stores';
import type { History } from 'types/history';

type ItemListProps = {
  history: History;
};

const ItemList = ({ history }: ItemListProps) => {
  const save = useHistoriesStore((state) => state.save);

  return (
    <ol className="space-y-1 pt-2 pb-1" data-testid="history-card-items">
      {history.items.map((item) => (
        <li
          key={history.routine.id + '-' + item.item.id}
          className="flex h-7 w-full items-center justify-between space-x-2 pr-1"
        >
          <div className="w-full">
            <Checkbox
              label={item.item.title}
              name={history.routine.id + '-' + item.item.id}
              color={history.routine.color}
              checked={!!item.completedAt}
              onChange={(e) => save(history.routine, item.item, e.target.checked)}
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
  const [minimized, toggleMinimized] = useReducer((prev) => !prev, false);

  return (
    <div className={`px-4 py-3 bg-${history.routine.color}-50`} data-testid="history-card">
      <div className="flex h-7 items-center justify-between space-x-3">
        <div className="flex max-w-[440px] items-center space-x-3">
          <h3 className={`text-sm font-semibold uppercase text-${history.routine.color}-600 truncate`}>
            {history.routine.title}{' '}
          </h3>
          {history.routine.time && (
            <span className={`text-sm font-medium text-${history.routine.color}-400 ml-2 flex-shrink-0 tabular-nums`}>
              {history.routine.time}
            </span>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center space-x-1">
          <button
            className={clsx(`rounded-md p-1 hover:bg-${history.routine.color}-100`, minimized && 'rotate-180')}
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
