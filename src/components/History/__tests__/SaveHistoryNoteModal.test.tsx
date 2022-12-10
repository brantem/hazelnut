import dayjs from 'dayjs';
import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveHistoryNoteModal from 'components/History/SaveHistoryNoteModal';

import { History } from 'types/history';
import { useModalStore } from 'lib/stores';
import { useHistoriesStore } from 'lib/stores';
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

describe('SaveHistoryNoteModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open edit item modal', () => {
    const modal = renderHook(() => useModalStore());

    render(<SaveHistoryNoteModal />);

    expect(screen.queryByTestId('save-history-note-modal')).not.toBeInTheDocument();
    act(() => modal.result.current.show(constants.modals.saveHistoryNote));
    expect(screen.getByTestId('save-history-note-modal')).toBeInTheDocument();
  });

  it('should save note', async () => {
    const modal = renderHook(() => useModalStore());

    const { result } = renderHook(() => useHistoriesStore());
    const saveNote = vi.spyOn(result.current, 'saveNote').mockImplementationOnce(() => {});

    render(<SaveHistoryNoteModal />);

    act(() => {
      result.current.setHistory(history);
      modal.result.current.show(constants.modals.saveHistoryNote);
    });
    fireEvent.change(screen.getByLabelText('Note'), { target: { value: ' a ' } });
    act(() => screen.getByText('Save').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(saveNote).toHaveBeenCalledWith(history.id, history.date, 'a');
  });
});
