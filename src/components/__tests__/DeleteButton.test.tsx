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
    const { container } = render(<DeleteButton text="A" confirmText="B" onConfirm={onConfirm} />);

    expect(container).toMatchSnapshot();
    const button = screen.getByText('A');
    expect(button).toBeInTheDocument();
    act(() => button.click());
    expect(screen.queryByText('A')).not.toBeInTheDocument();

    const confirm = screen.getByText('B');
    expect(confirm).toBeInTheDocument();
    act(() => confirm.click());
    expect(onConfirm).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });

  it('should timed out', async () => {
    render(<DeleteButton timeout={1000} onConfirm={() => {}} />);

    const button = screen.getByText('Delete');
    expect(button).toBeInTheDocument();
    act(() => button.click());
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersToNextTimer();
    });
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
