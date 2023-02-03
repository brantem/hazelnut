import { useCallback } from 'react';
import dayjs from 'dayjs';

import RoutineCard from 'components/Routine/RoutineCard';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import { isMatch, sortRoutines, isRoutineActive } from 'lib/helpers';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const RoutineList = () => {
  const search = useSearch(constants.searches.routines);
  const selectedDate = useHistoriesStore((state) => state.selectedDate);
  const routines = useRoutinesStore(
    useCallback(
      (state) => {
        const currentDate = dayjs().startOf('day').toISOString();
        const routines =
          currentDate === selectedDate
            ? sortRoutines(state.routines.filter((routine) => isRoutineActive(routine)))
            : sortRoutines(state.routines);
        if (!search.value) return routines;
        return routines.filter((routine) => isMatch(routine.title, search.value));
      },
      [selectedDate, search.value],
    ),
  );

  return (
    <section className="space-y-3" data-testid="routine-list">
      {routines.length
        ? routines.map((routine, i) => <RoutineCard key={i} routine={routine} showAction isItemSortable />)
        : search.value && <p className="mx-4 mt-3 text-center text-neutral-500">No results found</p>}
    </section>
  );
};

export default RoutineList;
