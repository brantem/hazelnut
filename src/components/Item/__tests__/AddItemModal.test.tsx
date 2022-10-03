import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddItemModal from 'components/Item/AddItemModal';

import { useItemsStore } from 'lib/stores';

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('AddItemModal', async () => {
  const { result } = renderHook(() => useItemsStore());
  const add = vi.spyOn(result.current, 'add');

  const onClose = vi.fn(() => {});
  render(<AddItemModal groupId="group-1" isOpen onClose={onClose} />);

  act(() => {
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
    screen.getByText('Add').click();
  });
  await waitFor(() => new Promise((res) => setTimeout(res, 0)));
  const values = { title: 'Item 1' };
  expect(add).toHaveBeenCalledWith('group-1', values);
  expect(onClose).toHaveBeenCalled();
});
