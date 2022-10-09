import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import Search from 'components/Search';
import Dates from 'components/Routine/Dates';
import RoutineCard from 'components/Routine/RoutineCard';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';
import SaveItemsToRoutineModal from 'components/Item/SaveItemsToRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';
import { isMatch, getMinutesFromTime } from 'lib/helpers';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const Routines: NextPage = () => {
  const clearRoutine = useRoutinesStore((state) => () => state.routine ? state.setRoutine(null) : void 0);
  const saveRoutineModal = useModal(constants.modals.saveRoutine);

  const search = useSearch(constants.searches.routines);
  const routines = useRoutinesStore(
    useCallback(
      (state) => {
        const routines = state.routines.sort((a, b) => getMinutesFromTime(a.time) - getMinutesFromTime(b.time));
        if (!search.value) return routines;
        return routines.filter((routine) => isMatch(routine.title, search.value));
      },
      [search.value],
    ),
  );

  const [isSearching, toggleIsSearching] = useReducer((prev) => !prev, false);

  return (
    <>
      <Layout
        header={{
          actions: [
            {
              text: <MagnifyingGlassIcon className="h-5 w-5" />,
              className: '!px-1.5',
              onClick: () => {
                if (isSearching) search.change('');
                toggleIsSearching();
              },
              testId: 'routines-search',
            },
            {
              text: 'Add Routine',
              onClick: () => {
                clearRoutine();
                saveRoutineModal.show();
              },
            },
          ],
        }}
      >
        {isSearching && (
          <Search
            placeholder="Search for routine titles"
            searchKey={constants.searches.routines}
            className="sticky top-0 bg-white px-4 pt-1 pb-3"
          />
        )}

        <Dates />

        <section className="space-y-3">
          {routines.length
            ? routines.map((routine, i) => <RoutineCard key={i} routine={routine} showAction isItemSortable />)
            : search && <p className="mx-4 mt-3 text-center text-neutral-500">No results found</p>}
        </section>
      </Layout>

      <SaveRoutineModal />
      <DuplicateRoutineModal />

      <SaveItemsToRoutineModal />

      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
