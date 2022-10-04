import { render, screen, act } from '@testing-library/react';

import '@testing-library/jest-dom';

import DayPicker from 'components/DayPicker';

describe('DayPicker', () => {
  it('should render successfully', () => {
    const onChange = vi.fn(() => {});
    const { container, rerender } = render(<DayPicker value={[]} onChange={onChange} />);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('[aria-checked="true"]')).not.toBeInTheDocument();
    const option = screen.getByTestId('day-picker-option-monday');
    act(() => option.click());
    expect(onChange).toHaveBeenCalledWith(['MONDAY']);
    rerender(<DayPicker value={['MONDAY']} onChange={() => {}} />);
    expect(option).toHaveAttribute('aria-checked', 'true');
    expect(container).toMatchSnapshot();

    // test space
  });

  it("shouldn't be selectable when disabled", () => {
    const onChange = vi.fn(() => {});
    const { container } = render(<DayPicker value={[]} onChange={onChange} isDisabled />);

    expect(container).toMatchSnapshot();
    act(() => screen.getByTestId('day-picker-option-monday').click());
    expect(onChange).not.toHaveBeenCalled();

    // test space
  });
});
