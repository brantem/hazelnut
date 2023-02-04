import dayjs from 'dayjs';
import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import HistoryCard from 'components/History/HistoryCard';

import { useHistoriesStore, useModalStore } from 'lib/stores';
import { History } from 'types/history';
import * as constants from 'data/constants';
import { ItemType } from 'types/item';

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
      type: ItemType.Number,
      title: 'Item 2',
      settings: {
        minCompleted: 0,
        step: 1,
      },
      value: 0,
      completedAt: null,
    },
    {
      id: 'item-3',
      type: ItemType.Number,
      title: 'Item 3',
      settings: {
        minCompleted: 1,
        step: 1,
      },
      value: 0,
      completedAt: null,
    },
  ],
  createdAt: 0,
};

describe('HistoryCard', () => {
  it('should open settings modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory').mockImplementation(() => {});

    render(<HistoryCard history={history} />);

    act(() => screen.getByTestId('history-card-settings').click());
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(show).toHaveBeenCalledWith(constants.modals.historySettings);
  });

  it('should show note', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory').mockImplementation(() => {});

    const _history = { ...history, note: 'a' };
    render(<HistoryCard history={_history} />);

    expect(screen.getByTestId('note')).toBeInTheDocument();
    act(() => screen.getByTestId('note-action').click());
    expect(setHistory).toHaveBeenCalledWith(_history);
    expect(show).toHaveBeenCalledWith(constants.modals.saveHistoryNote);
  });

  it('should be minimizable', () => {
    const { rerender } = render(<HistoryCard history={history} />);

    expect(screen.getByTestId('history-card-items')).toBeInTheDocument();
    act(() => screen.getByTestId('history-card-minimize').click());
    rerender(<HistoryCard history={history} />);
    expect(screen.queryByTestId('history-card-items')).not.toBeInTheDocument();
  });

  it('should save item', () => {
    const { result } = renderHook(() => useHistoriesStore());
    const saveItem = vi.spyOn(result.current, 'saveItem').mockImplementation(() => {});

    render(<HistoryCard history={history} />);

    act(() => screen.getByText('Item 1').click());
    expect(saveItem).toHaveBeenCalledWith(history.id, history.items[0].id, { done: true });
  });

  it('should save number item', async () => {
    const histories = renderHook(() => useHistoriesStore());
    const saveItem = vi.spyOn(histories.result.current, 'saveItem').mockImplementation(() => {});

    const { rerender } = render(<HistoryCard history={history} />);
    act(() => screen.getAllByTestId('number-input-increment')[0].click());
    expect(saveItem).toHaveBeenCalledWith(history.id, history.items[1].id, { value: 1, done: true });

    const _history = { ...history };
    _history.items[1].value = 1;
    _history.items[1].completedAt = Date.now();
    rerender(<HistoryCard history={_history} />);
    act(() => screen.getAllByTestId('number-input-decrement')[0].click());
    expect(saveItem).toHaveBeenCalledWith(_history.id, _history.items[1].id, { value: 0, done: true });
  });

  it('should open add items settings modal', () => {
    const modal = renderHook(() => useModalStore());
    const show = vi.spyOn(modal.result.current, 'show').mockImplementation(() => {});

    const { result } = renderHook(() => useHistoriesStore());
    const setHistory = vi.spyOn(result.current, 'setHistory').mockImplementation(() => {});

    render(<HistoryCard history={history} />);

    act(() => screen.getByTestId('history-card-items-settings').click());
    expect(setHistory).toHaveBeenCalledWith(history);
    expect(show).toHaveBeenCalledWith(constants.modals.historyItemsSetttings);
  });
});
