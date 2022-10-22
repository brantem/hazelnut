import dayjs from 'dayjs';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Recurrence from 'components/Recurrence';

describe('Recurrence', () => {
  it('should render successfully', () => {
    const startAt = dayjs().startOf('day').valueOf();
    const onChange = vi.fn(() => {});
    const { container, rerender } = render(
      <Recurrence value={{ startAt, interval: 1 }} onChange={onChange} showNext />,
    );

    // change startAt
    expect(container.querySelector('p')?.textContent).toContain(dayjs(startAt).add(1, 'day').format('D MMM YYYY'));
    const newStartAt = dayjs().add(1, 'day').startOf('day').valueOf();
    fireEvent.change(container.querySelector('[name="recurrence.startAt"]')!, {
      target: { value: dayjs(newStartAt).format('YYYY-MM-DD') },
    });
    expect(onChange).toHaveBeenCalledWith({ startAt: newStartAt, interval: 1 });
    rerender(<Recurrence value={{ startAt: newStartAt, interval: 1 }} onChange={onChange} showNext />);
    expect(container.querySelector('p')?.textContent).toContain(dayjs(newStartAt).add(1, 'day').format('D MMM YYYY'));

    // change interval
    fireEvent.change(container.querySelector('[name="recurrence.interval"]')!, { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith({ startAt: newStartAt, interval: 2 });
    rerender(<Recurrence value={{ startAt: newStartAt, interval: 2 }} onChange={onChange} showNext />);
    expect(container.querySelector('p')?.textContent).toContain(dayjs(newStartAt).add(2, 'day').format('D MMM YYYY'));

    // invalid interval
    fireEvent.change(container.querySelector('[name="recurrence.interval"]')!, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith({ startAt: newStartAt, interval: NaN });
    rerender(<Recurrence value={{ startAt: newStartAt, interval: NaN }} onChange={onChange} showNext />);
    expect(container.querySelector('p')?.textContent).toContain('-');
  });
});
