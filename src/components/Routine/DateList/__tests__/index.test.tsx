import { render, renderHook, act, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import DateList from 'components/Routine/DateList';

import { historiesStore, useHistoriesStore } from 'lib/stores';

describe('DateList', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();

    vi.useFakeTimers();
    act(() => {
      historiesStore.setState({
        histories: [
          { date: dayjs().startOf('day').subtract(2, 'day').toISOString() },
          { date: dayjs().startOf('day').subtract(2, 'day').toISOString() },
          { date: dayjs().startOf('day').subtract(1, 'day').toISOString() },
          { date: dayjs().startOf('day').toISOString() },
        ] as any,
      });
    });
    vi.useRealTimers();
  });

  afterEach(() => {
    act(() => historiesStore.setState({ selectedDate: null }));
  });

  it('should change date', () => {
    const { result } = renderHook(() => useHistoriesStore());
    const setSelectedDate = vi.spyOn(result.current, 'setSelectedDate');

    render(<DateList />);

    const action = screen.getByTestId('date-list-action');
    expect(action).toHaveAttribute('aria-selected', 'true');

    act(() => screen.getAllByTestId('date-list-item')[2].click());
    expect(setSelectedDate).toHaveBeenCalledWith(dayjs().startOf('day').toISOString());

    act(() => action.click());
    expect(setSelectedDate).toHaveBeenCalledWith(null);
  });
});
