import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutinesStore, useItemsStore, useModalStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-1'],
  minimized: false,
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
    expect(screen.getByTestId('routine-card-items')).toBeInTheDocument();
  });

  it('should show action button', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useRoutinesStore());
    const setRoutine = vi.spyOn(result.current, 'setRoutine').mockImplementation(() => {});
    const showSaveItems = vi.spyOn(result.current, 'showSaveItems').mockImplementation(() => {});

    const { container } = render(<RoutineCard routine={routine} showAction />);

    expect(container).toMatchSnapshot();
    act(() => screen.getByTestId('routine-card-save-items').click());
    expect(showSaveItems).toHaveBeenCalledWith(routine);

    act(() => screen.getByTestId('routine-card-settings').click());
    expect(setRoutine).toHaveBeenCalledWith(routine);
    expect(show).toHaveBeenCalledWith(constants.modals.routineSettings);
  });

  it('should show sort handle', () => {
    const { container } = render(<RoutineCard routine={routine} isItemSortable />);

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('routine-item-handle')).toBeInTheDocument();
  });

  it('should be minimizable', () => {
    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit').mockImplementation(() => {});

    const { rerender } = render(<RoutineCard routine={routine} />);

    expect(screen.getByTestId('routine-card-items')).toBeInTheDocument();
    act(() => screen.getByTestId('routine-card-minimize').click());
    expect(edit).toHaveBeenCalledWith('routine-1', { minimized: true });
    rerender(<RoutineCard routine={{ ...routine, minimized: true }} />);
    expect(screen.queryByTestId('routine-card-items')).not.toBeInTheDocument();
  });
});
