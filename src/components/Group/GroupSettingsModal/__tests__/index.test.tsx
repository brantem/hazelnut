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
  act(() => result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as any));

  const onEditClick = vi.fn(() => {});
  render(<GroupSettingsModal groupId="group-1" isOpen onClose={() => {}} onEditClick={onEditClick} />);

  act(() => screen.getByText('Edit').click());
  expect(onEditClick).toHaveBeenCalled();
});
