import { Day, Recurrence } from 'types/shared';

export type RoutineV1 = {
  id: string;
  title: string;
  color: string;
  days: Day[];
  time: string | null;
  itemIds: string[];
  minimized: boolean;
  createdAt: number;
};

export type Routine = Omit<RoutineV1, 'days'> & { recurrence: Recurrence };
