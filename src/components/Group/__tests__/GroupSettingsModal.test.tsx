import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
};

describe('GroupSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => {
      result.current.hide();
      result.current.resetAfterHide();
    });
  });

  it('should open settings modal', () => {
    const { result } = renderHook(() => useGroupsStore());

    render(<GroupSettingsModal />);

    expect(screen.queryByTestId('group-settings-modal')).not.toBeInTheDocument();
    act(() => result.current.showSettings(group));
    expect(screen.getByTestId('group-settings-modal')).toBeInTheDocument();
  });

  it('should open edit modal', () => {
    const { result } = renderHook(() => useGroupsStore());
    const showSave = vi.spyOn(result.current, 'showSave');

    render(<GroupSettingsModal />);

    act(() => result.current.showSettings(group));
    act(() => screen.getByText('Edit').click());
    expect(showSave).toHaveBeenCalledWith();
    // TODO: check clear
  });

  it('should delete group', () => {
    const groups = renderHook(() => useGroupsStore());
    const remove = vi.spyOn(groups.result.current, 'remove');

    const { result } = renderHook(() => useGroupsStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<GroupSettingsModal />);

    act(() => result.current.showSettings(group));
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('group-1');
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
