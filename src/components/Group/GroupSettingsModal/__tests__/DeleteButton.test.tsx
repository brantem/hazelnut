import { render, renderHook, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import DeleteButton from 'components/Group/GroupSettingsModal/DeleteButton';
import { useGroupsStore } from 'lib/stores';

describe('DeleteButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render successfully', () => {
    const { result } = renderHook(() => useGroupsStore());
    const remove = vi.spyOn(result.current, 'remove');

    const onClick = vi.fn(() => {});
    const { container } = render(<DeleteButton groupId="group-1" onClick={onClick} />);

    expect(container).toMatchSnapshot();
    const button = screen.getByText('Delete');
    expect(button).toBeInTheDocument();
    act(() => button.click());
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    const confirm = screen.getByText('Click to Confirm');
    expect(confirm).toBeInTheDocument();
    act(() => confirm.click());
    expect(remove).toHaveBeenCalledWith('group-1');
    expect(onClick).toHaveBeenCalled();
    expect(container).toMatchSnapshot();
  });

  it('should timed out', async () => {
    render(<DeleteButton groupId="group-1" onClick={() => {}} />);

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
