import { DBSchema } from 'idb';

import { Item } from 'types/item';
import { Group } from 'types/group';
import { Routine, RoutineV1 } from 'types/routine';
import { History } from 'types/history';

export interface SchemaV1 extends DBSchema {
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
    value: RoutineV1;
  };
  histories: {
    key: [string, string];
    value: History;
  };
}

export interface SchemaV2 extends DBSchema {
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

export interface SchemaV3 extends DBSchema {
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
    indexes: { createdAt: number };
  };
}

export interface Schema extends DBSchema {
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
    indexes: { date: string };
  };
}
