import { render, act, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Item from 'components/Routine/DateList/Item';

describe('Item', () => {
  it('should be selectable', async () => {
    const onSelected = vi.fn();
    const { rerender } = render(
      <Item label="Label" isSelected={false} onSelected={onSelected} data-testid="item">
        Children
      </Item>,
    );

    const item = screen.getByTestId('item');
    expect(item).toHaveAttribute('aria-selected', 'false');
    act(() => item.click());
    expect(onSelected).toHaveBeenCalled();
    rerender(
      <Item label="Label" isSelected={true} onSelected={onSelected} data-testid="item">
        Children
      </Item>,
    );
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('should be selectable using keyboard', async () => {
    const onSelected = vi.fn();
    const { rerender } = render(
      <Item label="Label" isSelected={false} onSelected={onSelected} data-testid="item">
        Children
      </Item>,
    );

    const item = screen.getByTestId('item');
    fireEvent.keyDown(item, { code: 'Space' });
    expect(item).toHaveAttribute('aria-selected', 'false');
    act(() => item.click());
    expect(onSelected).toHaveBeenCalled();
    rerender(
      <Item label="Label" isSelected={true} onSelected={onSelected} data-testid="item">
        Children
      </Item>,
    );
    expect(item).toHaveAttribute('aria-selected', 'true');
  });
});
