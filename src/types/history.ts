import { Routine } from 'types/routine';
import { Item } from 'types/item';

export type HistoryItem = Pick<Item, 'id' | 'title'> & {
  completedAt: number | null;
};

export type History = Pick<Routine, 'id' | 'title' | 'color' | 'time'> & {
  date: string;
  items: HistoryItem[];
};

type HistoryItemV0 = {
  itemId: string;
  date: string;
};

export type HistoryV0 = {
  routineId: string;
  date: string;
  items: HistoryItemV0[];
};
