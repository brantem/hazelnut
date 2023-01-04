import dayjs from 'dayjs';
import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveHistoryItemsModal from 'components/History/SaveHistoryItemsModal';

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
    {
      id: 'item-2',
      title: 'Item 2',
      completedAt: null,
    },
  ],
  createdAt: 0,
};

describe('SaveHistoryItemsModal', () => {
  beforeAll(() => {
    const groups = renderHook(() => useGroupsStore());
    act(() => {
      groups.result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as Group);
      groups.result.current.add({ id: 'group-2', title: 'Group 2', color: 'red' } as Group);
    });

    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      items.result.current.add('group-1', { id: 'item-2', title: 'Item 2' } as Item);
      items.result.current.add('group-2', { id: 'item-3', title: 'Item 3' } as Item);
    });
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should save items', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useHistoriesStore());
    const removeItems = vi.spyOn(result.current, 'removeItems').mockImplementation(() => {});
    const addItems = vi.spyOn(result.current, 'addItems').mockImplementation(() => {});

    render(<SaveHistoryItemsModal />);
    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.addExistingItemsToHistory);
    });
    expect(screen.getByLabelText('Item 2')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText('Item 3')).toHaveAttribute('aria-checked', 'false');
    act(() => {
      screen.getByText('Item 2').click();
      screen.getByText('Item 3').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(removeItems).toHaveBeenCalledWith(history.id, history.date, ['item-2']);
    expect(addItems).toHaveBeenCalledWith(history.id, history.date, ['item-3']);
    expect(hide).toHaveBeenCalled();
  });
});
