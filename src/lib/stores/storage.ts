import { openDB, DBSchema, IDBPObjectStore, IDBPDatabase, StoreNames, StoreValue, StoreKey } from 'idb';

import { Item } from 'types/item';
import { Group } from 'types/group';
import { Routine } from 'types/routine';
import { History } from 'types/history';

interface Schema extends DBSchema {
  items: {
    key: string;
    value: Item;
  };
  groups: {
    key: string;
    value: Group;
  };
  routines: {
    key: string;
    value: Routine;
  };
  histories: {
    key: [string, string];
    value: History;
  };
}

export const migrateFromLocalStorage = <Name extends StoreNames<Schema>>(
  store: IDBPObjectStore<Schema, ArrayLike<StoreNames<Schema>>, Name, 'versionchange'>,
  name: Name,
) => {
  const value = localStorage.getItem(name);
  if (value) {
    const items = JSON.parse(value).state[name];
    for (let i = 0; i < items.length; i++) {
      store.add({ ...items[i], createdAt: Date.now() + i });
    }
    // localStorage.removeItem(name);
  }
};

class Storage {
  db: Promise<IDBPDatabase<Schema>>;

  constructor() {
    this.db = openDB('hazelnut', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          const items = db.createObjectStore('items', { keyPath: 'id' });
          migrateFromLocalStorage(items, 'items');
        }

        if (!db.objectStoreNames.contains('groups')) {
          const groups = db.createObjectStore('groups', { keyPath: 'id' });
          migrateFromLocalStorage(groups, 'groups');
        }

        if (!db.objectStoreNames.contains('routines')) {
          const routines = db.createObjectStore('routines', { keyPath: 'id' });
          migrateFromLocalStorage(routines, 'routines');
        }

        if (!db.objectStoreNames.contains('histories')) {
          const histories = db.createObjectStore('histories', { keyPath: ['id', 'date'] });
          migrateFromLocalStorage(histories, 'histories');
        }
      },
    });
  }

  async add<Name extends StoreNames<Schema>>(name: Name, value: StoreValue<Schema, Name>) {
    const db = await this.db;
    return db.add(name, value);
  }

  async get<Name extends StoreNames<Schema>>(name: Name, key: string) {
    const db = await this.db;
    return db.get(name, key);
  }

  async getAll<Name extends StoreNames<Schema>>(name: Name) {
    const db = await this.db;
    return db.getAll(name);
  }

  async put<Name extends StoreNames<Schema>>(name: Name, value: StoreValue<Schema, Name>) {
    const db = await this.db;
    return db.put(name, value);
  }

  async delete<Name extends StoreNames<Schema>>(name: Name, key: StoreKey<Schema, Name>) {
    const db = await this.db;
    return db.delete(name, key);
  }
}

/* c8 ignore start */
const dummy = {
  add: () => {},
  get: () => {},
  getAll: () => [],
  put: () => {},
  delete: () => {},
};
/* c8 ignore stop */

// TODO: test this once i find a way to mock window.indexedDB
const storage = typeof window !== 'undefined' && 'indexedDB' in window ? new Storage() : dummy;
export default storage;
