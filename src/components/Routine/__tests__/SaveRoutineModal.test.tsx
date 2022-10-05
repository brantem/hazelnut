import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveRoutineModal from 'components/Routine/SaveRoutineModal';

import { Routine } from 'types/routine';
import { useRoutinesStore } from 'lib/stores';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: [],
};

describe('SaveRoutineModal', () => {
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

  it('should open save modal', () => {
    const { result } = renderHook(() => useRoutinesStore());

    render(<SaveRoutineModal />);

    expect(screen.queryByTestId('save-routine-modal')).not.toBeInTheDocument();
    act(() => result.current.showSave());
    expect(screen.getByTestId('save-routine-modal')).toBeInTheDocument();
  });

  it('should add new routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const add = vi.spyOn(result.current, 'add');
    const hide = vi.spyOn(result.current, 'hide');

    render(<SaveRoutineModal />);

    act(() => result.current.showSave());
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1' } });
      screen.getByTestId('day-picker-option-monday').click();
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '00:00' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' };
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });

  it('should edit existing routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit');
    const hide = vi.spyOn(result.current, 'hide');

    render(<SaveRoutineModal />);

    act(() => result.current.showSave(routine));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByTestId('day-picker-option-tuesday').click();
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '01:00' } });
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Routine 1a', color: 'amber', days: ['MONDAY', 'TUESDAY'], time: '01:00' };
    expect(edit).toHaveBeenCalledWith(routine.id, values);
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
