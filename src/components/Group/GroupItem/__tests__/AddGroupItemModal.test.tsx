import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddGroupItemModal from 'components/Group/GroupItem/AddGroupItemModal';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('AddGroupItemModal', async () => {
  const onClose = vi.fn(() => {});
  const onSubmit = vi.fn(() => {});
  render(<AddGroupItemModal isOpen onClose={onClose} onSubmit={onSubmit} />);

  act(() => {
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
    screen.getByText('Add').click();
  });
  await waitFor(() => new Promise((res) => setTimeout(res, 0)));
  const values = { title: 'Item 1' };
  expect(onSubmit).toHaveBeenCalledWith(values);
  expect(onClose).toHaveBeenCalled();
});
