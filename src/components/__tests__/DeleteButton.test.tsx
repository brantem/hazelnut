import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import DeleteButton from 'components/DeleteButton';

describe('DeleteButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render successfully', () => {
    const onConfirm = vi.fn(() => {});
    const { container } = render(<DeleteButton onConfirm={onConfirm} />);

    expect(container).toMatchSnapshot();
    const button = screen.getByText('Delete');
    expect(button).toBeInTheDocument();
    act(() => button.click());
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    const confirm = screen.getByText('Click to Confirm');
    expect(confirm).toBeInTheDocument();
    act(() => confirm.click());
    expect(onConfirm).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });

  it('should timed out', async () => {
    render(<DeleteButton onConfirm={() => {}} />);

    const button = screen.getByText('Delete');
    expect(button).toBeInTheDocument();
    act(() => button.click());
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Click to Confirm')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersToNextTimer();
    });
    expect(screen.queryByText('Click to Confirm')).not.toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
