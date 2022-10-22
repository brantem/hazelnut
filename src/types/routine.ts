import { Day } from 'types/shared';

export type Routine = {
  id: string;
  title: string;
  color: string;
  days?: Day[];
  recurrence?: {
    startAt: number;
    interval: number;
  };
  time: string | null;
  itemIds: string[];
  minimized: boolean;
  createdAt: number;
};
