import dayjs from 'dayjs';
import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddExistingItemsToHistoryModal from 'components/History/AddExistingItemsToHistoryModal';

import { useGroupsStore, useItemsStore, useModalStore, useHistoriesStore } from 'lib/stores';
import { History } from 'types/history';
import { Group } from 'types/group';
import { Item } from 'types/item';
import * as constants from 'data/constants';

const history: History = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  time: '00:00',
  date: dayjs().startOf('day').toISOString(),
  items: [
    {
      id: 'item-1',
      title: 'Item 1',
      completedAt: null,
    },
  ],
  createdAt: 0,
};

describe('AddExistingItemsToHistoryModal', () => {
  beforeAll(() => {
    const groups = renderHook(() => useGroupsStore());
    act(() => {
      groups.result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as Group);
      groups.result.current.add({ id: 'group-2', title: 'Group 2', color: 'red' } as Group);
    });

    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      items.result.current.add('group-2', { id: 'item-2', title: 'Item 2', createdAt: 0 } as Item);
    });
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add item to history', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useHistoriesStore());
    const addItems = vi.spyOn(result.current, 'addItems').mockImplementation(() => {});

    render(<AddExistingItemsToHistoryModal />);
    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.addExistingItemsToHistory);
    });
    expect(screen.getByLabelText('Item 2')).toHaveAttribute('aria-checked', 'false');
    act(() => {
      screen.getByText('Item 2').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(addItems).toHaveBeenCalledWith(history.id, history.date, [
      { id: 'item-2', groupId: 'group-2', title: 'Item 2', createdAt: 0 },
    ]);
    expect(hide).toHaveBeenCalled();
  });
});
