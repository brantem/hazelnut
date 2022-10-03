import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('RoutineSettingsModal', async () => {
  const { result } = renderHook(() => useRoutinesStore());
  const remove = vi.spyOn(result.current, 'remove').mockImplementation(() => {});
  act(() => result.current.add({ id: 'routine-1', title: 'Routine 1', color: 'red', days: ['MONDAY'] } as any));

  const onClose = vi.fn(() => {});
  const onEditClick = vi.fn(() => {});
  render(<RoutineSettingsModal routineId="routine-1" isOpen onClose={onClose} onEditClick={onEditClick} />);

  act(() => screen.getByText('Edit').click());
  expect(onEditClick).toHaveBeenCalled();

  act(() => screen.getByText('Delete').click());
  act(() => screen.getByText('Confirm').click());
  expect(remove).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
});
