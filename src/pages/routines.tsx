import { useCallback, useReducer } from 'react';
import type { NextPage } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import Search from 'components/Search';
import RoutineCard from 'components/Routine/RoutineCard';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';
import SaveItemsToRoutineModal from 'components/Item/SaveItemsToRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';
import { isMatch, getMinutesFromTime } from 'lib/helpers';
import { useSearch } from 'lib/hooks';

const Routines: NextPage = () => {
  const search = useSearch('routines');
  const { showSave, clearRoutine } = useRoutinesStore((state) => ({
    showSave: state.showSave,
    clearRoutine: () => (state.routine ? state.setRoutine(null) : void 0),
  }));
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
                showSave();
              },
            },
          ],
        }}
      >
        {isSearching && (
          <Search
            placeholder="Search for routine titles"
            searchKey="routines"
            className="sticky top-0 bg-white px-4 pt-1 pb-3"
          />
        )}

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
