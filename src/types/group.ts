export type Group = {
  id: string;
  title: string;
  items: GroupItem[];
  color: string;
};

export type GroupItem = {
  id: string;
  title: string;
};
