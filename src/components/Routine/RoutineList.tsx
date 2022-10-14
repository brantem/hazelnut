import { useCallback } from 'react';

import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutinesStore } from 'lib/stores';
import { isMatch, sortRoutines } from 'lib/helpers';
import { useSearch } from 'lib/hooks';
import * as constants from 'data/constants';

const RoutineList = () => {
  const search = useSearch(constants.searches.routines);
  const routines = useRoutinesStore(
    useCallback(
      (state) => {
        const routines = sortRoutines(state.routines);
        if (!search.value) return routines;
        return routines.filter((routine) => isMatch(routine.title, search.value));
      },
      [search.value],
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
