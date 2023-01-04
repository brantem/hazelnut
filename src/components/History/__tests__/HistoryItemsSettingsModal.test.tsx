import dayjs from 'dayjs';
import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import HistoryItemsSettingsModal from 'components/History/HistoryItemsSettingsModal';

import { useModalStore, useHistoriesStore } from 'lib/stores';
import { History } from 'types/history';
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

describe('HistoryItemsSettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open save items modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory');

    render(<HistoryItemsSettingsModal />);

    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.historyItemsSetttings);
    });
    act(() => screen.getByText('Edit').click());
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(show).toHaveBeenCalledWith(constants.modals.addExistingItemsToHistory);
  });

  it('should open add new item modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory');

    render(<HistoryItemsSettingsModal />);

    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.historyItemsSetttings);
    });
    act(() => screen.getByText('Add New Item').click());
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(show).toHaveBeenCalledWith(constants.modals.addRawItemToHistory);
  });
});
