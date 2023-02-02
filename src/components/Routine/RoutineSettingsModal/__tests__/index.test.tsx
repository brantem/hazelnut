import dayjs from 'dayjs';
import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useModalStore, historiesStore, useHistoriesStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  recurrence: {
    startAt: 0,
    interval: 1,
    frequency: 'WEEKLY',
    days: ['MONDAY'],
  },
  time: '00:00',
  itemIds: [],
  minimized: false,
  createdAt: 0,
};

const _history = {
  id: routine.id,
  date: dayjs().startOf('day').toISOString(),
  items: [],
} as any;

describe('RoutineSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open edit modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useRoutinesStore());
    const setRoutine = vi.spyOn(result.current, 'setRoutine');

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Edit').click());
    expect(setRoutine).toHaveBeenCalledWith(routine);
    expect(show).toHaveBeenCalledWith(constants.modals.saveRoutine);
  });

  it('should show "Add Note"', async () => {
    await act(() => historiesStore.setState({ histories: [_history] }));

    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useRoutinesStore());

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Add Note').click());
    expect(show).toHaveBeenCalledWith(constants.modals.saveHistoryNote);
    await act(() => historiesStore.setState({ histories: [] }));
  });

  it('should show "Edit Note"', async () => {
    const _history2 = { ..._history, note: 'a' };
    await act(() => historiesStore.setState({ histories: [_history2 as any] }));

    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useRoutinesStore());

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Edit Note').click());
    expect(show).toHaveBeenCalledWith(constants.modals.saveHistoryNote);
    await act(() => historiesStore.setState({ histories: [] }));
  });

  it('should open duplicate modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useRoutinesStore());
    const setRoutine = vi.spyOn(result.current, 'setRoutine');

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Duplicate').click());
    expect(setRoutine).toHaveBeenCalledWith(routine);
    expect(show).toHaveBeenCalledWith(constants.modals.duplicateRoutine);
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
  });

  it('should delete history', async () => {
    await act(() => historiesStore.setState({ histories: [_history] }));

    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const history = renderHook(() => useHistoriesStore());
    const remove = vi.spyOn(history.result.current, 'remove');

    const { result } = renderHook(() => useRoutinesStore());

    render(<RoutineSettingsModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.routineSettings);
    });
    act(() => screen.getByText('Delete History').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith(_history.id, _history.date);
    expect(hide).toHaveBeenCalledWith();
    await act(() => historiesStore.setState({ histories: [] }));
  });
});
