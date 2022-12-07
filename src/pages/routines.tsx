import { useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Router from 'next/router';

import Layout from 'components/Layout';
import MonthPickerAction from 'components/Routine/MonthPickerAction';
import Search from 'components/Search';
import DateList from 'components/Routine/DateList';
import RoutineList from 'components/Routine/RoutineList';
import HistoryList from 'components/History/HistoryList';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';
import SaveItemsToRoutineModal from 'components/Routine/SaveItemsToRoutineModal';
import AddExistingItemsToHistoryModal from 'components/History/AddExistingItemsToHistoryModal';
import AddMissingRoutineModal from 'components/History/AddMissingRoutineModal';
import HistorySettingsModal from 'components/History/HistorySettingsModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';
import EmptySection from 'components/sections/EmptySection';

import { useHistoriesStore, useRoutinesStore, useItemsStore } from 'lib/stores';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const Routines: NextPage = () => {
  const isHistory = useHistoriesStore((state) => !!state.selectedDate);
  const routines = useRoutinesStore((state) => ({ isEmpty: state.routines.length === 0, isReady: state.isReady }));
  const items = useItemsStore((state) => ({ isEmpty: state.items.length === 0, isReady: state.isReady }));
  const clearRoutine = useRoutinesStore((state) => () => state.routine && state.setRoutine(null));
  const search = useSearch(constants.searches.routines);
  const saveRoutineModal = useModal(constants.modals.saveRoutine);
  const addMissingRoutineModal = useModal(constants.modals.addMissingRoutine);

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
              className: clsx('!px-1.5', isSearching && 'bg-neutral-100'),
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
              children: 'Add Missing Routine',
              onClick: () => addMissingRoutineModal.show(),
              testId: 'routines-add-missing',
              skip: isEmpty || !isHistory,
            },
          ],
        }}
      >
        {!isEmpty ? (
          <>
            {isSearching && (
              <Search
                placeholder="Search for routines by title"
                searchKey={constants.searches.routines}
                className="sticky top-0 bg-white px-4 pt-1 pb-3"
              />
            )}

            <DateList />

            {!isHistory ? <RoutineList /> : <HistoryList />}
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
      <AddExistingItemsToHistoryModal />
      <AddMissingRoutineModal />

      <HistorySettingsModal />
      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
