import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveRoutineModal from 'components/Routine/SaveRoutineModal';

import { useRoutinesStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('SaveRoutineModal', () => {
  it('should add new routine', async () => {
    const onClose = vi.fn(() => {});
    const onSubmit = vi.fn(() => {});
    render(<SaveRoutineModal isOpen onClose={onClose} routineId={null} onSubmit={onSubmit} />);

    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1' } });
      screen.getByTestId('day-picker-option-monday').click();
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '00:00' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' };
    expect(onSubmit).toHaveBeenCalledWith(values);
    expect(onClose).toHaveBeenCalled();
  });

  it('should edit existing routine', async () => {
    const { result } = renderHook(() => useRoutinesStore());
    act(() =>
      result.current.add({ id: 'routine-1', title: 'Routine 1', color: 'red', days: ['MONDAY'], time: '00:00' } as any),
    );

    const onClose = vi.fn(() => {});
    const onSubmit = vi.fn(() => {});
    render(<SaveRoutineModal isOpen onClose={onClose} routineId="routine-1" onSubmit={onSubmit} />);

    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Routine 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByTestId('day-picker-option-tuesday').click();
      fireEvent.change(screen.getByLabelText('Time'), { target: { value: '01:00' } });
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Routine 1a', color: 'amber', days: ['MONDAY', 'TUESDAY'], time: '01:00' };
    expect(onSubmit).toHaveBeenCalledWith(values);
    expect(onClose).toHaveBeenCalled();
  });
});
