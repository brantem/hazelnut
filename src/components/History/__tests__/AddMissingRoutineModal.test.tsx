import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddMissingRoutineModal from 'components/History/AddMissingRoutineModal';

import { useModalStore, historiesStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  recurrence: {
    startAt: 0,
    interval: 1,
    frequency: 'DAILY',
    days: [],
  },
  time: null,
  itemIds: [],
  minimized: false,
  createdAt: 0,
};

describe('AddMissingRoutineModal', () => {
  beforeAll(async () => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add(routine);
      routines.result.current.add({ ...routine, id: 'routine-2', title: 'Routine 2' } as any);
    });
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add missing routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const add = vi.spyOn(historiesStore.getState(), 'add').mockImplementation(() => {});

    render(<AddMissingRoutineModal />);
    act(() => modal.result.current.show(constants.modals.addMissingRoutine));
    expect(screen.getByLabelText('Routine 2')).toHaveAttribute('aria-checked', 'false');
    act(() => {
      screen.getByText('Routine 2').click();
      screen.getByText('Save').click();
    });
    expect(add).toHaveBeenCalledWith({ ...routine, id: 'routine-2', title: 'Routine 2' });
    expect(hide).toHaveBeenCalled();
  });
});
