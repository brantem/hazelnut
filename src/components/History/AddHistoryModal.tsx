import { useCallback, useState } from 'react';

import BottomSheet from 'components/BottomSheet';
import Radio from 'components/Radio';
import Search from 'components/Search';
import Button from 'components/Button';

import { useHistoriesStore, useRoutinesStore } from 'lib/stores';
import { isMatch, sortRoutines } from 'lib/helpers';
import { useModal, useSearch } from 'lib/hooks';
import * as constants from 'data/constants';
import { Routine } from 'types/routine';

const AddHistoryModal = () => {
  const add = useHistoriesStore((state) => state.add);
  const currentRoutineIds = useHistoriesStore((state) => {
    if (!state.selectedDate) return [];
    return state.histories.reduce(
      (ids, history) => (history.date === state.selectedDate ? [...ids, history.id] : ids),
      [] as string[],
    );
  });
  const modal = useModal(constants.modals.addHistory);

  const search = useSearch(constants.searches.addHistory);
  const routines = useRoutinesStore(
    useCallback(
      (state) => {
        const routines = state.routines.filter((routine) => {
          return !currentRoutineIds.includes(routine.id) && isMatch(routine.title, search.value);
        });
        return sortRoutines(routines);
      },
      [currentRoutineIds, search.value],
    ),
  );
  const isSearchEmpty = useRoutinesStore(
    useCallback(
      (state) => state && state.routines.findIndex((routine) => isMatch(routine.title, search.value)) === -1,
      [search.value],
    ),
  );

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  return (
    <BottomSheet
      isOpen={modal.isOpen}
      onClose={modal.hide}
      /* c8 ignore start */
      onAfterClose={() => {
        if (selectedRoutine) setSelectedRoutine(null);
        if (search) search.change('');
      }}
      /* c8 ignore stop */
      title="Add Routine"
      data-testid="add-history-modal"
    >
      <ol className="max-h-[75vh] flex-1 space-y-3 px-4 pb-3 dark:text-white">
        {routines.map((routine) => (
          <li key={routine.id} className="pr-1">
            <Radio
              label={
                <>
                  {routine.title}
                  {routine.time && <span className="ml-2 text-neutral-500">{routine.time}</span>}
                </>
              }
              name={constants.modals.addHistory}
              value={routine.id}
              checked={selectedRoutine?.id === routine.id}
              onChange={() => setSelectedRoutine(routine)}
            />
          </li>
        ))}

        {isSearchEmpty && <li className="text-neutral-500">No results found</li>}
      </ol>

      <div className="space-y-3 bg-neutral-50 px-4 py-3 dark:bg-neutral-900/50">
        <Search placeholder="Search for routines by title" searchKey={constants.searches.addHistory} />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          onClick={() => {
            if (selectedRoutine) add(selectedRoutine.id);
            modal.hide();
          }}
          disabled={!selectedRoutine}
        >
          Save
        </Button>
      </div>
    </BottomSheet>
  );
};

export default AddHistoryModal;
