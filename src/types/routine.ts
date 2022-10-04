import { Day } from 'types/shared';

export type Routine = {
  id: string;
  title: string;
  color: string;
  days: Day[];
  time: string;
  itemIds: string[];
};
