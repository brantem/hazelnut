import { useReducer, useMemo } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import clsx from 'clsx';

import Layout from 'components/Layout';
import Search from 'components/Search';
import Dates from 'components/Routine/Dates';
import RoutineList from 'components/Routine/RoutineList';
import HistoryList from 'components/History/HistoryList';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';
import SaveItemsToRoutineModal from 'components/Item/SaveItemsToRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const Routines: NextPage = () => {
  const { selectedDate, setSelectedDate } = useHistoriesStore((state) => ({
    selectedDate: state.selectedDate,
    setSelectedDate: state.setSelectedDate,
  }));
  const clearRoutine = useRoutinesStore((state) => () => state.routine ? state.setRoutine(null) : void 0);
  const saveRoutineModal = useModal(constants.modals.saveRoutine);
  const search = useSearch(constants.searches.routines);

  const [isSearching, toggleIsSearching] = useReducer((prev) => !prev, false);

  const currentDate = useMemo(() => dayjs().startOf('day').toISOString(), []);
  const isTodaySelected = !selectedDate || selectedDate === currentDate;

  return (
    <>
      <Layout
        header={{
          actions: [
            {
              text: <MagnifyingGlassIcon className="h-5 w-5" />,
              className: clsx('!px-1.5', isSearching && 'bg-neutral-100'),
              onClick: () => {
                if (isSearching) search.change('');
                toggleIsSearching();
              },
              testId: 'routines-search',
              skip: !isTodaySelected,
            },
            {
              text: 'Add Routine',
              onClick: () => {
                clearRoutine();
                if (!isTodaySelected) setSelectedDate(null);
                saveRoutineModal.show();
              },
              testId: 'routines-add',
            },
          ],
        }}
      >
        {isTodaySelected && isSearching && (
          <Search
            placeholder="Search for routine titles"
            searchKey={constants.searches.routines}
            className="sticky top-0 bg-white px-4 pt-1 pb-3"
          />
        )}

        <Dates />

        {isTodaySelected ? <RoutineList /> : <HistoryList />}
      </Layout>

      <SaveRoutineModal />
      <DuplicateRoutineModal />

      <SaveItemsToRoutineModal />

      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
