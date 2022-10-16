import { useEffect } from 'react';

import { itemsStore } from 'lib/stores/items';
import { groupsStore } from 'lib/stores/groups';
import { routinesStore } from 'lib/stores/routines';
import { historiesStore } from 'lib/stores/histories';
import storage from 'lib/stores/storage';

/* c8 ignore start */
export const useLoadStore = () => {
  useEffect(() => {
    (async () => {
      const [items, groups, routines, histories] = await Promise.all([
        storage.getAll('items'),
        storage.getAll('groups'),
        storage.getAll('routines'),
        storage.getAll('histories'),
      ]);

      itemsStore.setState({ items: items.sort((a, b) => a.createdAt - b.createdAt) });
      groupsStore.setState({ groups: groups.sort((a, b) => a.createdAt - b.createdAt) });
      routinesStore.setState({ routines });
      historiesStore.setState({ histories, selectedDate: localStorage.getItem('historySelectedDate') });
    })();
  }, []);
};
/* c8 ignore stop */

export * from 'lib/stores/items';
export * from 'lib/stores/groups';
export * from 'lib/stores/routines';
export * from 'lib/stores/search';
export * from 'lib/stores/histories';
export * from 'lib/stores/modal';
