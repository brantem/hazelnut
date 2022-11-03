import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';

import { Routine } from 'types/routine';
import { useModalStore, useRoutinesStore } from 'lib/stores';
import * as constants from 'data/constants';
import { pick } from 'lib/helpers';

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

describe('DuplicateRoutineModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should duplicate routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const add = vi.spyOn(result.current, 'add');

    render(<DuplicateRoutineModal />);

    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.duplicateRoutine);
    });
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Routine 1 - Copy ' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Duplicate').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = {
      ...pick(routine, ['recurrence', 'itemIds', 'time']),
      title: 'Routine 1 - Copy',
      color: 'amber',
    };
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
  });
});
