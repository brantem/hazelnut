import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Days from 'components/Days';

describe('Days', () => {
  it('should show "Everyday"', () => {
    const { container } = render(
      <Days days={['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']} />,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByText('Everyday'));
  });

  it('should show only "M"', () => {
    const { container } = render(<Days days={['MONDAY']} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('M'));
  });
});
