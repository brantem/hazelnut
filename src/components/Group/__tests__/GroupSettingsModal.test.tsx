import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore, useModalStore } from 'lib/stores';
import { Group } from 'types/group';
import * as constants from 'data/constants';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
  createdAt: 0,
};

describe('GroupSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open edit modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useGroupsStore());
    const setGroup = vi.spyOn(result.current, 'setGroup');

    render(<GroupSettingsModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.groupSettings);
    });
    act(() => screen.getByText('Edit').click());
    expect(setGroup).toHaveBeenCalledWith(group);
    expect(show).toHaveBeenCalledWith(constants.modals.saveGroup);
  });

  it('should delete group', () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useGroupsStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(<GroupSettingsModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.groupSettings);
    });
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('group-1');
    expect(hide).toHaveBeenCalled();
  });
});
