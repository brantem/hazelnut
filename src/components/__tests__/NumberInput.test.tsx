import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import NumberInput from 'components/NumberInput';

test('NumberInput', () => {
  const onChange = vi.fn(() => {});
  const props = { label: 'Label', name: 'name', min: 0, max: 2, step: 2, value: 0, onChange };
  const { container, rerender } = render(<NumberInput {...props} />);

  expect(container).toMatchSnapshot();
  expect(screen.getByTestId('number-input-decrement')).toBeDisabled();
  act(() => screen.getByTestId('number-input-increment').click());
  expect(onChange).toHaveBeenCalledWith(2);
  rerender(<NumberInput {...props} value={2} />);
  expect(screen.getByTestId('number-input-increment')).toBeDisabled();
  act(() => screen.getByTestId('number-input-decrement').click());
  expect(onChange).toHaveBeenCalledWith(0);
});
