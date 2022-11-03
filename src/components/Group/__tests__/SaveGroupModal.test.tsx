import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveGroupModal from 'components/Group/SaveGroupModal';

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

describe('SaveGroupModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add new group', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useGroupsStore());
    const add = vi.spyOn(result.current, 'add');

    render(<SaveGroupModal />);

    act(() => modal.result.current.show(constants.modals.saveGroup));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Group 1 ' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1', color: 'red' };
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
  });

  it('should edit existing group', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useGroupsStore());
    const edit = vi.spyOn(result.current, 'edit');

    render(<SaveGroupModal />);

    act(() => {
      result.current.setGroup(group);
      modal.result.current.show(constants.modals.saveGroup);
    });
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1a', color: 'amber' };
    expect(edit).toHaveBeenCalledWith(group.id, values);
    expect(hide).toHaveBeenCalled();
  });
});
