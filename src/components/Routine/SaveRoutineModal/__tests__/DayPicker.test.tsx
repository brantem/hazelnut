import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import DayPicker from 'components/Routine/SaveRoutineModal/DayPicker';

describe('DayPicker', () => {
  it('should be clickable', () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<DayPicker value={[]} onChange={onChange} />);

    const option = screen.getByTestId('day-picker-option-monday');
    expect(option).toHaveAttribute('aria-checked', 'false');
    act(() => option.click());
    expect(onChange).toHaveBeenCalledWith(['MONDAY']);
    rerender(<DayPicker value={['MONDAY']} onChange={() => {}} />);
    expect(option).toHaveAttribute('aria-checked', 'true');
  });

  it('should be selectable', async () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<DayPicker value={[]} onChange={onChange} />);

    const option = screen.getByTestId('day-picker-option-monday');
    expect(option).toHaveAttribute('aria-checked', 'false');
    fireEvent.keyDown(option, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(onChange).toHaveBeenCalledWith(['MONDAY']);
    rerender(<DayPicker value={['MONDAY']} onChange={() => {}} />);
    expect(option).toHaveAttribute('aria-checked', 'true');
  });

  it('should be able to unselect', async () => {
    const onChange = vi.fn(() => {});
    const { rerender } = render(<DayPicker value={['MONDAY']} onChange={onChange} />);

    const option = screen.getByTestId('day-picker-option-monday');
    expect(option).toHaveAttribute('aria-checked', 'true');
    act(() => option.click());
    expect(onChange).toHaveBeenCalledWith([]);
    rerender(<DayPicker value={[]} onChange={() => {}} />);
    expect(option).toHaveAttribute('aria-checked', 'false');
  });

  it("shouldn't be selectable when disabled", async () => {
    const onChange = vi.fn(() => {});
    render(<DayPicker value={[]} onChange={onChange} isDisabled />);

    const option = screen.getByTestId('day-picker-option-monday');
    act(() => option.click());
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(option, { code: 'Space' });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(onChange).not.toHaveBeenCalled();
  });
});
