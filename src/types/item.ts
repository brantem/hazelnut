export enum ItemType {
  Bool,
  Number,
}

type BaseItem = {
  id: string;
  groupId: string;
  title: string;
  createdAt: number;
};

export type Item =
  | (BaseItem & {
      type?: ItemType.Bool;
      settings?: Record<string, never>;
    })
  | (BaseItem & {
      type: ItemType.Number;
      settings: {
        minCompleted: number;
        step: number;
      };
    });
