import { render, renderHook, act, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import MonthPickerAction from 'components/Routine/MonthPickerAction';

import { historiesStore, useHistoriesStore } from 'lib/stores';
import dayjs from 'dayjs';

describe('MonthPickerAction', () => {
  beforeEach(() => {
    act(() => historiesStore.setState({ selectedMonth: dayjs().format('YYYY-MM') }));
  });

  it('should change month', async () => {
    const { result } = renderHook(() => useHistoriesStore());
    const setSelectedMonth = vi.spyOn(result.current, 'setSelectedMonth').mockImplementation(() => {});

    render(<MonthPickerAction />);

    expect(screen.getByTestId('month-action-button')).toHaveTextContent(dayjs().format('MMM'));
    const value = dayjs().subtract(1, 'month').format('YYYY-MM');
    fireEvent.change(screen.getByTestId('month-action-input'), { target: { value } });
    expect(setSelectedMonth).toHaveBeenCalledWith(value);
  });

  it('should show year', async () => {
    act(() => historiesStore.setState({ selectedMonth: dayjs().subtract(1, 'year').format('YYYY-MM') }));

    render(<MonthPickerAction />);

    const button = screen.getByTestId('month-action-button');
    expect(button).toHaveTextContent(dayjs().subtract(1, 'year').format('MMM YYYY'));
  });
});
