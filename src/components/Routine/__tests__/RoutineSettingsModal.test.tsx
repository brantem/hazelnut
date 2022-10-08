import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useModalStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: [],
  minimized: false,
};

describe('RoutineSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open duplicate modal', () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useRoutinesStore());
    const showDuplicate = vi.spyOn(result.current, 'showDuplicate');

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Duplicate').click());
    expect(showDuplicate).toHaveBeenCalledWith(routine);
    // TODO: check clear
  });

  it('should open edit modal', () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useRoutinesStore());
    const showSave = vi.spyOn(result.current, 'showSave');

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Edit').click());
    expect(showSave).toHaveBeenCalledWith(routine);
    // TODO: check clear
  });

  it('should delete routine', () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('routine-1');
    expect(hide).toHaveBeenCalledWith();
    // TODO: check clear
  });
});
