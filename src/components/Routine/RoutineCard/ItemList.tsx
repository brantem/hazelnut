import Checkbox from 'components/Checkbox';

import { useItemsStore } from 'lib/stores';
import { Routine } from 'types/routine';

type ItemListProps = {
  routine: Routine;
};

const ItemList = ({ routine }: ItemListProps) => {
  const items = useItemsStore((state) => state.items.filter((item) => routine.itemIds.includes(item.id)));
  if (!items.length) return null;

  return (
    <ol className="space-y-1 pt-2 pb-1" data-testid="routine-card-items">
      {items.map((item) => (
        <li data-testid="routine-card-items-item" key={item.id} className="flex items-center justify-between space-x-3">
          <Checkbox label={item.title} name={routine.id + '-' + item.id} color={routine.color} />
        </li>
      ))}
    </ol>
  );
};

export default ItemList;
