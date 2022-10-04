import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutineStore, useItemsStore } from 'lib/stores';
import { Routine } from 'types/routine';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
};

describe('RoutineCard', () => {
  beforeEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Routine));
  });

  afterEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));
  });

  it('should render successfully', () => {
    const { container } = render(<RoutineCard routine={routine} />);

    expect(container).toMatchSnapshot();
    expect(screen.getAllByTestId('routine-card-items-item')).toHaveLength(1);
  });

  it('should show action button', () => {
    const { result } = renderHook(() => useRoutineStore());
    const showSaveItems = vi.spyOn(result.current, 'showSaveItems').mockImplementation(() => {});
    const showSettings = vi.spyOn(result.current, 'showSettings').mockImplementation(() => {});

    const { container } = render(<RoutineCard routine={routine} showAction />);

    expect(container).toMatchSnapshot();
    act(() => screen.getByTestId('routine-card-save-items').click());
    expect(showSaveItems).toHaveBeenCalledWith(routine);

    act(() => screen.getByTestId('routine-card-settings').click());
    expect(showSettings).toHaveBeenCalledWith(routine);
  });

  it('should show action button', () => {
    const { container } = render(<RoutineCard routine={routine} isItemDraggable />);

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('routine-card-items-item-handle')).toBeInTheDocument();
  });
});
