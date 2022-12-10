import { useEffect } from 'react';
import dayjs from 'dayjs';

import { itemsStore } from 'lib/stores/items';
import { groupsStore } from 'lib/stores/groups';
import { routinesStore } from 'lib/stores/routines';
import { historiesStore, getHistories } from 'lib/stores/histories';
import storage from 'lib/stores/storage';

export const useLoadStore = () => {
  useEffect(() => {
    (async () => {
      const selectedMonth = dayjs().startOf('month');
      const [items, groups, routines, histories] = await Promise.all([
        storage.getAll('items'),
        storage.getAll('groups'),
        storage.getAll('routines'),
        getHistories(selectedMonth.valueOf(), dayjs().endOf('month').valueOf()),
      ]);

      itemsStore.setState({ items: items.sort((a, b) => a.createdAt - b.createdAt), isReady: true });
      groupsStore.setState({ groups: groups.sort((a, b) => a.createdAt - b.createdAt), isReady: true });
      routinesStore.setState({ routines, isReady: true });
      historiesStore.setState({
        histories,
        selectedMonth: selectedMonth.format('YYYY-MM'),
        selectedDate: localStorage.getItem('history-selected-date'),
      });
    })();
  }, []);
};

export * from 'lib/stores/items';
export * from 'lib/stores/groups';
export * from 'lib/stores/routines';
export * from 'lib/stores/search';
export * from 'lib/stores/histories';
export * from 'lib/stores/modal';
