import dayjs from 'dayjs';
import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddRawItemToHistoryModal from 'components/History/AddRawItemToHistoryModal';

import { useHistoriesStore, useModalStore } from 'lib/stores';
import { ItemType } from 'types/item';
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

describe('AddRawItemToHistoryModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add raw item to history', async () => {
    const modal = renderHook(() => useModalStore());

    const histories = renderHook(() => useHistoriesStore());
    const addRawItem = vi.spyOn(histories.result.current, 'addRawItem').mockImplementationOnce(() => {});

    render(<AddRawItemToHistoryModal />);

    act(() => {
      histories.result.current.setHistory(history);
      modal.result.current.show(constants.modals.addRawItemToHistory);
    });
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Item 1 ' } });
    act(() => screen.getByText('Add').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1', type: ItemType.Bool, settings: {} };
    expect(addRawItem).toHaveBeenCalledWith(history.id, history.date, values);
  });
});
