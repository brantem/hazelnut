import { render, screen, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ItemList from 'components/Routine/RoutineCard/ItemList';

import { Routine } from 'types/routine';
import { useItemsStore } from 'lib/stores';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
};

describe('ItemList', () => {
  beforeEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Routine);
      items.result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Routine);
    });
  });

  it('should render successfully', () => {
    const { container } = render(<ItemList routine={routine} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });
});
