import dayjs from 'dayjs';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import Recurrence from 'components/Routine/SaveRoutineModal/Recurrence';

import { getCurrentDay } from 'lib/helpers';
import { Recurrence as Value } from 'types/shared';
import { sortDays } from 'lib/helpers';

const startAt = dayjs().startOf('day').valueOf();
const value: Value = { startAt, interval: 1, frequency: 'DAILY', days: [] };

describe('Recurrence', () => {
  it('should change interval', () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<Recurrence value={value} onChange={onChange} showNext />);

    fireEvent.change(screen.getByTestId('recurrence-interval'), { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith({ ...value, interval: 2 });
    rerender(<Recurrence value={{ ...value, interval: 2 }} onChange={onChange} showNext />);
    expect(screen.getByTestId('recurrence-next').textContent).toContain(
      dayjs(startAt).add(2, 'day').format('D MMM YYYY'),
    );
  });

  it('should handle empty interval', () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<Recurrence value={value} onChange={onChange} showNext />);

    fireEvent.change(screen.getByTestId('recurrence-interval'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith({ ...value, interval: NaN });
    rerender(<Recurrence value={{ ...value, interval: NaN }} onChange={onChange} showNext />);
    expect(screen.getByTestId('recurrence-next').textContent).toContain('-');
  });

  it('should change frequency', () => {
    const { rerender } = render(<Recurrence value={{ ...value, days: ['MONDAY'] }} onChange={() => {}} showNext />);
    const select: HTMLSelectElement = screen.getByTestId('recurrence-frequency');

    expect(select.value).toEqual('DAILY');
    fireEvent.change(select, { target: { value: 'WEEKLY' } });
    rerender(<Recurrence value={{ ...value, frequency: 'WEEKLY' }} onChange={() => {}} showNext />);
    expect(select.value).toEqual('WEEKLY');

    fireEvent.change(select, { target: { value: 'DAILY' } });
    rerender(<Recurrence value={{ ...value, frequency: 'DAILY' }} onChange={() => {}} showNext />);
    expect(select.value).toEqual('DAILY');
  });

  it('should change days', () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<Recurrence value={value} onChange={onChange} showNext />);
    const day = getCurrentDay();

    const _value: Value = { ...value, frequency: 'WEEKLY' };
    fireEvent.change(screen.getByTestId('recurrence-frequency'), { target: { value: 'WEEKLY' } });
    expect(onChange).toHaveBeenCalledWith({ ..._value, days: [day] });
    rerender(<Recurrence value={{ ..._value, days: [day] }} onChange={onChange} showNext />);

    const option = day === 'MONDAY' ? 'TUESDAY' : 'MONDAY';
    act(() => screen.getByTestId(`day-picker-option-${option.toLowerCase()}`).click());
    expect(onChange).toHaveBeenCalledWith({ ..._value, days: sortDays([day, option]) });
    rerender(<Recurrence value={{ ..._value, days: sortDays([day, option]) }} onChange={onChange} showNext />);

    act(() => screen.getByTestId(`day-picker-option-${day.toLowerCase()}`).click());
    expect(onChange).toHaveBeenCalledWith({ ..._value, days: [option] });
    rerender(<Recurrence value={{ ..._value, days: [option] }} onChange={onChange} showNext />);

    act(() => screen.getByTestId(`day-picker-option-${option.toLowerCase()}`).click());
    expect(onChange).toHaveBeenCalledWith({ ..._value, days: [day] });
  });
});
