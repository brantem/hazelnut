import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveGroupModal from 'components/Group/SaveGroupModal';

import { useGroupsStore } from 'lib/stores';
import { Group } from 'types/group';

const group: Group = {
  id: 'group-1',
  title: 'Group 1',
  color: 'red',
};

describe('SaveGroupModal', () => {
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

  it('should open save modal', () => {
    const { result } = renderHook(() => useGroupsStore());

    render(<SaveGroupModal />);

    expect(screen.queryByTestId('save-group-modal')).not.toBeInTheDocument();
    act(() => result.current.showSave());
    expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
  });

  it('should add new group', async () => {
    const groups = renderHook(() => useGroupsStore());
    const add = vi.spyOn(groups.result.current, 'add');

    const { result } = renderHook(() => useGroupsStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<SaveGroupModal />);

    act(() => result.current.showSave());
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1', color: 'red' };
    expect(add).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });

  it('should edit existing group', async () => {
    const groups = renderHook(() => useGroupsStore());
    const edit = vi.spyOn(groups.result.current, 'edit');

    const { result } = renderHook(() => useGroupsStore());
    const hide = vi.spyOn(result.current, 'hide');

    render(<SaveGroupModal />);

    act(() => result.current.showSave(group));
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1a', color: 'amber' };
    expect(edit).toHaveBeenCalledWith(group.id, values);
    expect(hide).toHaveBeenCalled();
    // TODO: check clear
  });
});
