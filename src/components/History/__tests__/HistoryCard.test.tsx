import { render, screen, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import HistoryCard from 'components/History/HistoryCard';

import { useHistoriesStore } from 'lib/stores';
import { History } from 'types/history';
import dayjs from 'dayjs';

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
};

describe('HistoryCard', () => {
  it('should be minimizable', () => {
    const { rerender } = render(<HistoryCard history={history} />);

    expect(screen.getByTestId('history-card-items')).toBeInTheDocument();
    act(() => screen.getByTestId('history-card-minimize').click());
    rerender(<HistoryCard history={history} />);
    expect(screen.queryByTestId('history-card-items')).not.toBeInTheDocument();
  });

  it('should save item', () => {
    const { result } = renderHook(() => useHistoriesStore());
    const save = vi.spyOn(result.current, 'save').mockImplementation(() => {});

    render(<HistoryCard history={history} />);

    act(() => screen.getByText('Item 1').click());
    expect(save).toHaveBeenCalledWith(history, history.items[0], true);
  });
});
