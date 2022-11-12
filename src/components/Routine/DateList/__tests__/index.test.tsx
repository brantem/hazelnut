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
          { date: dayjs().startOf('day').subtract(2, 'day').valueOf() },
          { date: dayjs().startOf('day').subtract(2, 'day').valueOf() },
          { date: dayjs().startOf('day').subtract(1, 'day').valueOf() },
          { date: dayjs().startOf('day').valueOf() },
        ] as any,
        selectedDate: null,
      });
    });
    vi.useRealTimers();
  });

  afterEach(() => {
    act(() => historiesStore.setState({ selectedMonth: undefined, selectedDate: null }));
  });

  it('should change month', () => {
    const { result } = renderHook(() => useHistoriesStore());
    const setSelectedMonth = vi
      .spyOn(result.current, 'setSelectedMonth')
      .mockImplementation((selectedMonth) => historiesStore.setState({ selectedMonth }));

    render(<DateList />);

    expect(screen.queryByTestId('date-list-next-month')).not.toBeInTheDocument();
    const prev = screen.getByTestId('date-list-previous-month');
    const prevMonth = dayjs().startOf('month').subtract(1, 'month');
    expect(prev).toHaveTextContent(prevMonth.format('MMM'));
    act(() => prev.click());
    act(() => prev.click());
    expect(setSelectedMonth).toHaveBeenCalledWith(prevMonth.toISOString());
    expect(prev).toHaveTextContent(prevMonth.subtract(2, 'month').format('MMM'));
    const next = screen.getByTestId('date-list-next-month');
    expect(next).toHaveTextContent(dayjs().subtract(1, 'month').format('MMM'));
    act(() => next.click());
    act(() => next.click());
    expect(setSelectedMonth).toHaveBeenCalledWith(undefined);
  });

  it('should show year', () => {
    const date = dayjs().subtract(1, 'year').startOf('month');
    act(() => historiesStore.setState({ selectedMonth: date.toISOString() }));
    render(<DateList />);

    expect(screen.getByTestId('date-list-previous-month')).toHaveTextContent(
      date.subtract(1, 'month').format('MMM YYYY'),
    );
    expect(screen.getByTestId('date-list-next-month')).toHaveTextContent(date.add(1, 'month').format('MMM YYYY'));
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
