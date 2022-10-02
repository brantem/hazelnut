import { render, renderHook, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveGroupModal from 'components/Group/SaveGroupModal';
import { useGroupsStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('SaveGroupModal', () => {
  it('should add new group', async () => {
    const onClose = vi.fn(() => {});
    const onSubmit = vi.fn(() => {});
    render(<SaveGroupModal isOpen onClose={onClose} groupId={null} onSubmit={onSubmit} />);

    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1', color: 'red' };
    expect(onSubmit).toHaveBeenCalledWith(values);
    expect(onClose).toHaveBeenCalled();
  });

  it('should edit existing group', async () => {
    const { result } = renderHook(() => useGroupsStore());
    act(() => result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as any));

    const onClose = vi.fn(() => {});
    const onSubmit = vi.fn(() => {});
    render(<SaveGroupModal isOpen onClose={onClose} groupId="group-1" onSubmit={onSubmit} />);

    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Group 1a', color: 'amber' };
    expect(onSubmit).toHaveBeenCalledWith(values);
    expect(onClose).toHaveBeenCalled();
  });
});
