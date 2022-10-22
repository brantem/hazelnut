import dayjs from 'dayjs';
import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveRoutineModal from 'components/Routine/SaveRoutineModal';

import { Routine } from 'types/routine';
import { useModalStore, useRoutinesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { getCurrentDay, pick, sortDays } from 'lib/helpers';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  recurrence: {
    startAt: dayjs().startOf('day').valueOf(),
    interval: 1,
    frequency: 'WEEKLY',
    days: [getCurrentDay()],
  },
  time: '00:00',
  itemIds: [],
  minimized: false,
  createdAt: 0,
};

describe('SaveRoutineModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it(' should add new routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const add = vi.spyOn(result.current, 'add').mockImplementationOnce(() => {});

    render(<SaveRoutineModal />);

    act(() => modal.result.current.show(constants.modals.saveRoutine));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1' } });
      fireEvent.change(screen.getByTestId('recurrence-frequency'), { target: { value: 'WEEKLY' } });
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '00:00' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = pick(routine, ['title', 'color', 'recurrence', 'time']);
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
  });

  it('should edit existing routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit');

    render(<SaveRoutineModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.saveRoutine);
    });
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByTestId('day-picker-option-tuesday').click();
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '01:00' } });
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = {
      title: 'Routine 1a',
      color: 'amber',
      recurrence: {
        startAt: dayjs().startOf('day').valueOf(),
        interval: 1,
        frequency: 'WEEKLY',
        days: sortDays([getCurrentDay(), 'TUESDAY']),
      },
      time: '01:00',
    };
    expect(edit).toHaveBeenCalledWith(routine.id, values);
    expect(hide).toHaveBeenCalled();
  });
});
