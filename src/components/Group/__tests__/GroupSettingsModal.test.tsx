import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import GroupSettingsModal from 'components/Group/GroupSettingsModal';

import { useGroupsStore, useModalStore, _useModalStore } from 'lib/stores';
import { Group } from 'types/group';
import { modals } from 'data/constants';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
  minimized: false,
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
    const modal = renderHook(() => useModalStore(modals.groupSettings));

    const { result } = renderHook(() => useGroupsStore());

    render(<GroupSettingsModal />);

    expect(screen.queryByTestId('group-settings-modal')).not.toBeInTheDocument();
    act(() => {
      result.current.setGroup(group);
      modal.result.current.show();
    });
    expect(screen.getByTestId('group-settings-modal')).toBeInTheDocument();
  });

  it('should open edit modal', () => {
    const modal = renderHook(() => useModalStore(modals.groupSettings));

    const { result } = renderHook(() => useGroupsStore());
    const showSave = vi.spyOn(result.current, 'showSave');

    render(<GroupSettingsModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show();
    });
    act(() => screen.getByText('Edit').click());
    expect(showSave).toHaveBeenCalledWith(group);
    // TODO: check clear
  });

  it('should delete group', () => {
    const modal = renderHook(() => _useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useGroupsStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(<GroupSettingsModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(modals.groupSettings);
    });
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith('group-1');
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
