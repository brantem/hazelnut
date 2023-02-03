import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Router from 'next/router';
import dayjs from 'dayjs';

import Layout from 'components/Layout';
import MonthPickerAction from 'components/Routine/MonthPickerAction';
import Search from 'components/Search';
import DateList from 'components/Routine/DateList';
import RoutineList from 'components/Routine/RoutineList';
import HistoryList from 'components/History/HistoryList';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';
import SaveItemsToRoutineModal from 'components/Routine/SaveItemsToRoutineModal';
import SaveHistoryItemsModal from 'components/History/SaveHistoryItemsModal';
import AddRawItemToHistoryModal from 'components/History/AddRawItemToHistoryModal';
import SaveHistoryNoteModal from 'components/History/SaveHistoryNoteModal';
import AddHistoryModal from 'components/History/AddHistoryModal';
import HistorySettingsModal from 'components/History/HistorySettingsModal';
import HistoryItemsSettingsModal from 'components/History/HistoryItemsSettingsModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';
import EmptySection from 'components/sections/EmptySection';

import { useHistoriesStore, useRoutinesStore, useItemsStore } from 'lib/stores';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';
import { cn } from 'lib/helpers';

const Routines: NextPage = () => {
  const { isHistory, isTodaySelected } = useHistoriesStore(
    useCallback((state) => {
      return {
        isHistory: !!state.selectedDate,
        isTodaySelected: state.selectedDate === dayjs().startOf('day').toISOString(),
      };
    }, []),
  );
  const routines = useRoutinesStore((state) => ({ isEmpty: state.routines.length === 0, isReady: state.isReady }));
  const items = useItemsStore((state) => ({ isEmpty: state.items.length === 0, isReady: state.isReady }));
  const clearRoutine = useRoutinesStore((state) => () => state.routine && state.setRoutine(null));
  const search = useSearch(constants.searches.routines);
  const saveRoutineModal = useModal(constants.modals.saveRoutine);
  const addHistoryModal = useModal(constants.modals.addHistory);

  const [isSearching, toggleIsSearching] = useReducer((prev) => !prev, search.value !== '');

  const isEmpty = routines.isEmpty || items.isEmpty;
  const isReady = /* c8 ignore next */ routines.isReady || items.isReady;

  return (
    <>
      <Layout
        header={{
          actions: [
            {
              children: <MagnifyingGlassIcon className="h-5 w-5" />,
              className: cn('!px-1.5', isSearching && 'bg-neutral-100 dark:bg-white dark:text-black'),
              onClick: () => {
                if (isSearching) search.change('');
                toggleIsSearching();
              },
              testId: 'routines-search',
              skip: isEmpty,
            },
            {
              render: () => <MonthPickerAction />,
              skip: isEmpty,
            },
            {
              children: 'Add Routine',
              onClick: () => {
                clearRoutine();
                saveRoutineModal.show();
              },
              testId: 'routines-add',
              skip: items.isEmpty || isHistory,
            },
            {
              children: 'Add Routine',
              onClick: () => addHistoryModal.show(),
              testId: 'routines-add-history',
              skip: isEmpty || !isHistory,
            },
          ],
        }}
      >
        {!isEmpty ? (
          <>
            {isSearching && (
              <div className="sticky top-0 bg-white px-4 pt-1 pb-3 dark:bg-black">
                <Search
                  placeholder="Search for routines by title"
                  searchKey={constants.searches.routines}
                  className="dark:bg-neutral-900"
                />
              </div>
            )}

            <DateList />

            {!isHistory || isTodaySelected ? <RoutineList /> : <HistoryList />}
          </>
        ) : (
          isReady && (
            <EmptySection
              title={`You have not created any ${items.isEmpty ? 'items' : 'routines'} yet`}
              action={{
                children: items.isEmpty ? 'Add Item' : 'Add Routine',
                onClick: () => (items.isEmpty ? Router.push('/items') : saveRoutineModal.show()),
              }}
            />
          )
        )}
      </Layout>

      <SaveRoutineModal />
      <DuplicateRoutineModal />

      <SaveItemsToRoutineModal />
      <SaveHistoryItemsModal />
      <AddRawItemToHistoryModal />
      <SaveHistoryNoteModal />
      <AddHistoryModal />

      <HistorySettingsModal />
      <HistoryItemsSettingsModal />
      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
