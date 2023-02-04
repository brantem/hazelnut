import { useReducer } from 'react';
import { EllipsisHorizontalIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Card from 'components/Card';
import NumberInput from 'components/NumberInput';
import Checkbox from 'components/Checkbox';
import Note from 'components/History/Note';

import { useHistoriesStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import type { History } from 'types/history';
import * as constants from 'data/constants';
import { ItemType } from 'types/item';
import { getNumberInputShade } from 'lib/helpers';

type ItemListProps = {
  history: History;
};

const ItemList = ({ history }: ItemListProps) => {
  const saveItem = useHistoriesStore((state) => state.saveItem);

  return (
    <ol className="space-y-1 pt-1" data-testid="history-card-items">
      {history.items.map((item) => (
        <li key={history.id + '-' + item.id} className="flex h-8 w-full items-center justify-between space-x-2 pr-1">
          {item.type === ItemType.Number ? (
            (() => {
              const minCompleted = item.settings!.minCompleted;
              const value = item.value!;
              const shade = getNumberInputShade(minCompleted, value);
              return (
                <NumberInput
                  label={item.title}
                  color={history.color}
                  value={value}
                  renderValue={(value) => `${value} / ${minCompleted}`}
                  onChange={(value) => saveItem(history.id, item.id, { value, done: value >= minCompleted })}
                  className={clsx(shade > 0 && `bg-${history.color}-${shade}`, shade > 300 && 'text-white')}
                  step={item.settings!.step}
                />
              );
            })()
          ) : (
            <Checkbox
              label={item.title}
              name={history.id + '-' + item.id}
              color={history.color}
              checked={!!item.completedAt}
              onChange={(e) => saveItem(history.id, item.id, { done: e.target.checked })}
            />
          )}
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
  const itemsSettingsModal = useModal(constants.modals.historyItemsSetttings);
  const settingsModal = useModal(constants.modals.historySettings);
  const saveNoteModal = useModal(constants.modals.saveHistoryNote);

  const [minimized, toggleMinimized] = useReducer((prev) => !prev, false);

  return (
    <Card
      color={history.color}
      title={
        <>
          <span>{history.title}</span>
          {history.time && (
            <span
              className={`text-sm font-medium text-${history.color}-500 dark:text-${history.color}-700 ml-2 flex-shrink-0 tabular-nums`}
            >
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
            itemsSettingsModal.show();
          },
          testId: 'history-card-items-settings',
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

      {!minimized && (
        <Note
          history={history}
          onActionClick={() => {
            setHistory(history);
            saveNoteModal.show();
          }}
        />
      )}
    </Card>
  );
};

export default HistoryCard;
