import dayjs from 'dayjs';
import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import HistorySettingsModal from 'components/History/HistorySettingsModal';

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

describe('HistorySettingsModal', async () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should show "Add Note"', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory');

    render(<HistorySettingsModal />);

    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.historySettings);
    });
    act(() => screen.getByText('Add Note').click());
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(show).toHaveBeenCalledWith(constants.modals.saveHistoryNote);
  });

  it('should show "Edit Note"', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show');

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory');

    render(<HistorySettingsModal />);

    const _history = { ...history, note: 'a' };
    act(() => {
      result.current.setHistory(_history);
      modal.result.current.show(constants.modals.historySettings);
    });
    act(() => screen.getByText('Edit Note').click());
    expect(setHistory).toHaveBeenCalledWith(_history);
    expect(show).toHaveBeenCalledWith(constants.modals.saveHistoryNote);
  });

  it('should delete history', () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useHistoriesStore());
    const remove = vi.spyOn(result.current, 'remove');

    render(<HistorySettingsModal />);

    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.historySettings);
    });
    act(() => screen.getByText('Delete').click());
    act(() => screen.getByText('Confirm').click());
    expect(remove).toHaveBeenCalledWith(history.id, history.date);
    expect(hide).toHaveBeenCalledWith();
  });
});
