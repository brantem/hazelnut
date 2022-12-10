import { useReducer } from 'react';
import { EllipsisHorizontalIcon, ChevronUpIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import Card from 'components/Card';
import NumberInput from 'components/NumberInput';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';

import { useHistoriesStore } from 'lib/stores';
import { useModal } from 'lib/hooks';
import type { History } from 'types/history';
import * as constants from 'data/constants';
import { ItemType } from 'types/item';
import { getNumberInputShade } from 'lib/helpers';

const Markdown = dynamic(() => import('components/Markdown'));

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
                  onChange={(value) => saveItem(history, item, { value, done: value >= minCompleted })}
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
              onChange={(e) => saveItem(history, item, { done: e.target.checked })}
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
            <span className={`text-sm font-medium text-${history.color}-500 ml-2 flex-shrink-0 tabular-nums`}>
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

      {!minimized && history.note && (
        <div className="pt-3" data-testid="history-card-note">
          <div className="mb-1 flex items-center justify-between space-x-3">
            <h4 className={`text-${history.color}-500`}>Note</h4>
            <Button
              color={history.color}
              variant="ghost"
              className="rounded-full !p-1"
              onClick={() => {
                setHistory(history);
                saveNoteModal.show();
              }}
              data-testid="history-card-note-action"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </Button>
          </div>
          <Markdown
            className="text-sm text-neutral-500"
            options={{
              overrides: {
                hr: {
                  props: {
                    className: 'border-neutral-300',
                  },
                },
              },
            }}
          >
            {history.note}
          </Markdown>
        </div>
      )}
    </Card>
  );
};

export default HistoryCard;
