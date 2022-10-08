import { render, renderHook, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DuplicateRoutineModal from 'components/Routine/DuplicateRoutineModal';

import { Routine } from 'types/routine';
import { useRoutinesStore } from 'lib/stores';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: [],
  minimized: false,
};

describe('DuplicateRoutineModal', () => {
  beforeAll(() => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() => result.current.add(routine));
  });

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
    const { result } = renderHook(() => useRoutinesStore());

    render(<DuplicateRoutineModal />);

    expect(screen.queryByTestId('duplicate-routine-modal')).not.toBeInTheDocument();
    act(() => result.current.showDuplicate(routine));
    expect(screen.getByTestId('duplicate-routine-modal')).toBeInTheDocument();
  });

  it('should duplicate routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const add = vi.spyOn(result.current, 'add');
    const hide = vi.spyOn(result.current, 'hide');

    render(<DuplicateRoutineModal />);

    act(() => result.current.showDuplicate(routine));
    act(() => {
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Duplicate').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = {
      title: 'Routine 1 - Copy',
      color: 'amber',
      days: routine.days,
      itemIds: routine.itemIds,
      time: routine.time,
    };
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
