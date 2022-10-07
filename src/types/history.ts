type HistoryItem = {
  itemId: string;
  date: string;
};

export type History = {
  routineId: string;
  date: string;
  items: HistoryItem[];
};
