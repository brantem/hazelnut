import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddHistoryModal from 'components/History/AddHistoryModal';

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

const routine2 = {
  ...routine,
  id: 'routine-2',
  title: 'Routine 2',
};

describe('AddHistoryModal', () => {
  beforeAll(async () => {
    const routines = renderHook(() => useRoutinesStore());
    act(() => {
      routines.result.current.add(routine);
      routines.result.current.add(routine2);
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

    render(<AddHistoryModal />);
    act(() => modal.result.current.show(constants.modals.addHistory));
    expect(screen.getByLabelText('Routine 2')).toHaveAttribute('aria-checked', 'false');
    act(() => {
      screen.getByText('Routine 2').click();
      screen.getByText('Save').click();
    });
    expect(add).toHaveBeenCalledWith(routine2.id);
    expect(hide).toHaveBeenCalled();
  });
});
