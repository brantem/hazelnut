import { useReducer, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import Header from 'components/Header';
import Button from 'components/Button';

import {
  itemsStore,
  useItemsStore,
  groupsStore,
  useGroupsStore,
  routinesStore,
  useRoutinesStore,
  historiesStore,
  useHistoriesStore,
} from 'lib/stores';
import storage from 'lib/stores/storage';

type CardProps = {
  title: string;
  data: any;
  onSave: (data: any[]) => void;
};

const buttonProps: any = {
  className: '!py-1 !rounded-md bg-neutral-100 enabled:hover:bg-neutral-200',
  color: 'neutral',
  variant: 'ghost',
  size: 'sm',
};

const Card = ({ title, data, onSave }: CardProps) => {
  const [isImportActive, setIsImportActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMinimized, toggle] = useReducer((prev) => !prev, true);
  const [value, setValue] = useState('');

  return (
    <section className="border-b">
      <div className="flex items-center justify-between space-x-3 px-4 py-2">
        <h3 className="truncate rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">{title}</h3>

        <div className="flex flex-shrink-0 items-center space-x-2">
          {isImportActive ? (
            <>
              <Button {...buttonProps} onClick={() => setIsImportActive(false)}>
                Cancel
              </Button>

              <Button
                {...buttonProps}
                onClick={() => {
                  if (value) {
                    try {
                      onSave(JSON.parse(value));
                      // eslint-disable-next-line no-empty
                    } catch {}
                  }
                  setIsImportActive(false);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                {...buttonProps}
                onClick={() => {
                  setValue('');
                  setIsImportActive(true);
                }}
              >
                Import
              </Button>

              <Button
                {...buttonProps}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(data));
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 1000);
                }}
              >
                {isCopied ? 'Copied' : 'Export'}
              </Button>

              <Button {...buttonProps} className={buttonProps.className + ' !px-1'} onClick={toggle}>
                <ChevronUpIcon className={clsx('h-5 w-5', isMinimized && 'rotate-180')} />
              </Button>
            </>
          )}
        </div>
      </div>

      {isImportActive ? (
        <input
          className="w-full bg-neutral-100 px-4 py-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        !isMinimized && (
          <pre className="max-h-96 overflow-y-auto bg-neutral-100 px-4 py-2">{JSON.stringify(data, null, 2)}</pre>
        )
      )}
    </section>
  );
};

const handleSave = (key: string, isIdb = true) => {
  return async (data: any) => {
    if (isIdb) {
      for (const value of data) {
        await storage.add(key as any, value);
      }
    }

    switch (key) {
      case 'histories.selectedDate':
        localStorage.setItem('history-selected-date', data);
        break;
      case 'groups':
        groupsStore.setState({ groups: data });
        break;
      case 'items':
        itemsStore.setState({ items: data });
        break;
      case 'routines':
        routinesStore.setState({ routines: data });
        break;
      case 'histories':
        historiesStore.setState({ histories: data });
        break;
    }
  };
};

const Debug: NextPage = () => {
  const items = useItemsStore((state) => state.items);
  const groups = useGroupsStore((state) => state.groups);
  const routines = useRoutinesStore((state) => state.routines);
  const { histories, selectedDate } = useHistoriesStore((state) => ({
    histories: state.histories,
    selectedDate: state.selectedDate,
  }));

  return (
    <>
      <Head>
        <title>Debug - hazelnut</title>
      </Head>

      <Header
        navigations={[
          {
            icon: <CodeBracketIcon className="h-6 w-6" />,
            href: '/_debug',
            text: 'Debug',
          },
        ]}
      />
      <main className="flex-1 overflow-y-auto">
        <Card title="groups" data={groups} onSave={handleSave('groups')} />
        <Card title="items" data={items} onSave={handleSave('items')} />
        <Card title="routines" data={routines} onSave={handleSave('routines')} />
        <Card title="histories" data={histories} onSave={handleSave('histories')} />
        <Card title="histories.selectedDate" data={selectedDate} onSave={handleSave('histories.selectedDate', false)} />
      </main>
    </>
  );
};

export default Debug;
