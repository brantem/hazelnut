import { Routine } from 'types/routine';
import { Item } from 'types/item';

type HistoryItem = {
  item: Pick<Item, 'id' | 'title'>;
  completedAt: number | null;
};

export type History = {
  routine: Pick<Routine, 'id' | 'title' | 'color' | 'time'>;
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
