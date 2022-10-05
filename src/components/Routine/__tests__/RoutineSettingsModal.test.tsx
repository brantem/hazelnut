import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: [],
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

  it('should open settings modal', () => {
    const { result } = renderHook(() => useRoutinesStore());

    render(<RoutineSettingsModal />);

    expect(screen.queryByTestId('routine-settings-modal')).not.toBeInTheDocument();
    act(() => result.current.showSettings(routine));
    expect(screen.getByTestId('routine-settings-modal')).toBeInTheDocument();
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useRoutinesStore());
    const showSave = vi.spyOn(result.current, 'showSave');

    render(<RoutineSettingsModal />);

    act(() => result.current.showSettings(routine));
    act(() => screen.getByText('Edit').click());
    expect(showSave).toHaveBeenCalledWith();
    // TODO: check clear
  });

  it('should delete routine', () => {
    const { result } = renderHook(() => useRoutinesStore());
    const remove = vi.spyOn(result.current, 'remove');
    const hide = vi.spyOn(result.current, 'hide');

    render(<RoutineSettingsModal />);

    act(() => result.current.showSettings(routine));
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('routine-1');
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
