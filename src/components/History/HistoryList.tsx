import { useCallback } from 'react';

import HistoryCard from 'components/History/HistoryCard';

import { useHistoriesStore } from 'lib/stores';

const HistoryList = () => {
  const histories = useHistoriesStore(
    useCallback((state) => {
      if (!state.selectedDate) return [];
      return state.histories.filter((history) => history.date === state.selectedDate);
    }, []),
  );

  return (
    <section className="space-y-3" data-testid="history-list">
      {histories.map((history, i) => (
        <HistoryCard key={i} history={history} />
      ))}
    </section>
  );
};

export default HistoryList;
