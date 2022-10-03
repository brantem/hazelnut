import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import ColorPicker from 'components/ColorPicker';

describe('ColorPicker', () => {
  it('should render successfully', () => {
    const onChange = vi.fn(() => {});
    const { container, rerender } = render(<ColorPicker value="" onChange={onChange} />);

    expect(container).toMatchSnapshot();
    expect(container.querySelector('[aria-checked="true"]')).not.toBeInTheDocument();
    const option = screen.getByTestId('color-picker-option-red');
    act(() => option.click());
    expect(onChange).toHaveBeenCalledWith('red');
    rerender(<ColorPicker value="red" onChange={() => {}} />);
    expect(option).toHaveAttribute('aria-checked', 'true');
    expect(container).toMatchSnapshot();
  });

  it("shouldn't be clickable if disabled", () => {
    const onChange = vi.fn(() => {});
    const { container } = render(<ColorPicker value="" onChange={onChange} isDisabled />);

    expect(container).toMatchSnapshot();
    screen.getByTestId('color-picker-option-red').click();
    expect(onChange).not.toHaveBeenCalled();
  });
});
