import { Routine } from 'types/routine';
import { Item } from 'types/item';

export type HistoryItem = Pick<Item, 'id' | 'title'> & {
  completedAt: number | null;
};

export type History = Pick<Routine, 'id' | 'title' | 'color' | 'time'> & {
  date: string;
  items: HistoryItem[];
  createdAt: number;
};
