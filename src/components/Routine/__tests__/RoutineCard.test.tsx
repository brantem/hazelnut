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
};

describe('RoutineCard', () => {
  beforeEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.add('routine-1', { id: 'item-1', title: 'Item 1' } as Routine));
  });

  afterEach(() => {
    const items = renderHook(() => useItemsStore());
    act(() => items.result.current.remove('item-1'));
  });

  it('should render successfully', () => {
    const { result } = renderHook(() => useRoutineStore());
    const showSettings = vi.spyOn(result.current, 'showSettings').mockImplementation(() => {});

    const { container } = render(<RoutineCard routine={routine} />);

    expect(container).toMatchSnapshot();

    act(() => screen.getByTestId('routine-card-settings').click());
    expect(showSettings).toHaveBeenCalledWith(routine);
  });
});
