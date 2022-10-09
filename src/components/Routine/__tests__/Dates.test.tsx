import { render, renderHook, act, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

import Dates from 'components/Routine/Dates';

import { useHistoriesStore } from 'lib/stores';

describe('Dates', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useHistoriesStore());
    act(() => {
      vi.setSystemTime(dayjs().subtract(2, 'day').toDate());
      result.current.save('routine-1', 'item-1', true);
      result.current.save('routine-2', 'item-2', true);
      vi.setSystemTime(dayjs().subtract(1, 'day').toDate());
      result.current.save('routine-1', 'item-1', true);
    });
    vi.useRealTimers();
  });

  afterEach(() => {
    const { result } = renderHook(() => useHistoriesStore());
    act(() => result.current.setSelectedDate(null));
  });

  it('should render successfully', async () => {
    const { result } = renderHook(() => useHistoriesStore());

    render(<Dates />);

    screen.debug();
    const items = screen.getAllByTestId('dates-item');
    expect(items).toHaveLength(3);
    expect(result.current.selectedDate).toBeNull();
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'false');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'true');
    act(() => items[1].click());
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'true');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'false');
  });

  it('should be selectable', async () => {
    render(<Dates />);

    const items = screen.getAllByTestId('dates-item');
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'false');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(items[1], { code: 'Space' });
    expect(items[1].firstChild).toHaveAttribute('aria-selected', 'true');
    expect(items[2].firstChild).toHaveAttribute('aria-selected', 'false');
  });
});
