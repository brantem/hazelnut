import { Recurrence } from 'types/shared';

export type Routine = {
  id: string;
  title: string;
  color: string;
  recurrence: Recurrence;
  time: string | null;
  itemIds: string[];
  minimized: boolean;
  createdAt: number;
};
