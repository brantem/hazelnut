import {
  openDB,
  IDBPObjectStore,
  IDBPDatabase,
  StoreNames,
  StoreValue,
  StoreKey,
  IDBPTransaction,
  IndexNames,
} from 'idb';

import { Schema, SchemaV1, SchemaV3 } from 'types/storage';
import { omit } from 'lib/helpers';

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

// i have no idea how to test this
/* c8 ignore start */
const migrateV0ToV1 = (db: IDBPDatabase<Schema>) => {
  const oldDb = db as unknown as IDBPDatabase<SchemaV1>;
  if (!oldDb.objectStoreNames.contains('items')) {
    const items = db.createObjectStore('items', { keyPath: 'id' });
    migrateFromLocalStorage(items, 'items');
  }

  if (!oldDb.objectStoreNames.contains('groups')) {
    const groups = db.createObjectStore('groups', { keyPath: 'id' });
    migrateFromLocalStorage(groups, 'groups');
  }

  if (!oldDb.objectStoreNames.contains('routines')) {
    const routines = db.createObjectStore('routines', { keyPath: 'id' });
    migrateFromLocalStorage(routines, 'routines');
  }

  if (!oldDb.objectStoreNames.contains('histories')) {
    const histories = db.createObjectStore('histories', { keyPath: ['id', 'date'] });
    migrateFromLocalStorage(histories, 'histories');
  }
};

const migrateV1ToV2 = async (transaction: IDBPTransaction<Schema, ArrayLike<StoreNames<Schema>>, 'versionchange'>) => {
  const oldTransaction = transaction as unknown as IDBPTransaction<SchemaV1>;
  const oldStore = oldTransaction.objectStore('routines');
  const store = transaction.objectStore('routines');

  const routines = await oldStore.getAll();
  for (const routine of routines) {
    const isEveryday = routine.days.length === 7;
    store.put({
      ...omit(routine, ['days']),
      recurrence: {
        startAt: routine.createdAt,
        interval: 1,
        frequency: isEveryday ? 'DAILY' : 'WEEKLY',
        days: isEveryday ? [] : routine.days,
      },
    });
  }
};

const migrateV2ToV3 = async (transaction: IDBPTransaction<Schema, ArrayLike<StoreNames<Schema>>, 'versionchange'>) => {
  // prettier-ignore
  const store = transaction.objectStore('histories') as unknown as IDBPObjectStore<SchemaV3, ArrayLike<StoreNames<Schema>>, "histories", "versionchange">;
  store.createIndex('createdAt', 'createdAt');
};

const migrateV3ToV4 = async (transaction: IDBPTransaction<Schema, ArrayLike<StoreNames<Schema>>, 'versionchange'>) => {
  const store = transaction.objectStore('histories');
  store.deleteIndex('createdAt');
  store.createIndex('date', 'date');
};

const VERSION = 4;

class Storage {
  db: Promise<IDBPDatabase<Schema>>;

  constructor() {
    this.db = openDB('hazelnut', VERSION, {
      async upgrade(db, oldVersion, _, transaction) {
        for (let i = oldVersion; i < VERSION; i++) {
          switch (i) {
            case 0:
              migrateV0ToV1(db);
              break;
            case 1:
              await migrateV1ToV2(transaction);
              break;
            case 2:
              await migrateV2ToV3(transaction);
              break;
            case 3:
              await migrateV3ToV4(transaction);
              break;
          }
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

  async index<Name extends StoreNames<Schema>>(name: Name, indexName: IndexNames<Schema, Name>) {
    const db = await this.db;
    return db.transaction(name).store.index(indexName);
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

const dummy = {
  add: () => {},
  get: () => {},
  index: () => {},
  getAll: () => [],
  put: () => {},
  delete: () => {},
};

const storage = typeof window !== 'undefined' && 'indexedDB' in window ? new Storage() : dummy;
export default storage;
/* c8 ignore stop */
