import { useCallback } from 'react';

import HistoryCard from 'components/History/HistoryCard';

import { useSearch } from 'lib/hooks';
import { useHistoriesStore } from 'lib/stores';
import { sortRoutines, isMatch } from 'lib/helpers';
import * as constants from 'data/constants';

const HistoryList = () => {
  const search = useSearch(constants.searches.routines);
  const histories = useHistoriesStore(
    useCallback(
      (state) => {
        if (!state.selectedDate) return [];
        const histories = sortRoutines(state.histories.filter((history) => history.date === state.selectedDate));
        if (!search.value) return histories;
        return histories.filter((history) => isMatch(history.title, search.value));
      },
      [search.value],
    ),
  );

  return (
    <section className="flex-1 space-y-3 overflow-y-auto" data-testid="history-list">
      {histories.length
        ? histories.map((history, i) => <HistoryCard key={i} history={history} />)
        : search.value && <p className="mx-4 mt-3 text-center text-neutral-500">No results found</p>}
    </section>
  );
};

export default HistoryList;
