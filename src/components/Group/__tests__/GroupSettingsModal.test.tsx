import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupSettingsModal from 'components/Group/GroupSettingsModal';
import { useGroupsStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('GroupSettingsModal', async () => {
  const { result } = renderHook(() => useGroupsStore());
  const remove = vi.spyOn(result.current, 'remove').mockImplementation(() => {});
  act(() => result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as any));

  const onClose = vi.fn(() => {});
  const onEditClick = vi.fn(() => {});
  render(<GroupSettingsModal groupId="group-1" isOpen onClose={onClose} onEditClick={onEditClick} />);

  act(() => screen.getByText('Edit').click());
  expect(onEditClick).toHaveBeenCalled();

  act(() => screen.getByText('Delete').click());
  act(() => screen.getByText('Click to Confirm').click());
  expect(remove).toHaveBeenCalled();
  expect(onClose).toHaveBeenCalled();
});
