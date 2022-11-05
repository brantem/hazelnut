import { Routine } from 'types/routine';
import { Item } from 'types/item';

export type HistoryItem = Pick<Item, 'id' | 'type' | 'title' | 'settings'> & {
  value?: number;
  completedAt: number | null;
};

export type History = Pick<Routine, 'id' | 'title' | 'color' | 'time'> & {
  date: string;
  items: HistoryItem[];
  createdAt: number;
};
