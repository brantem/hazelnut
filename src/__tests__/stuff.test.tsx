import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import Stuff from 'pages/stuff';

vi.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
  window.IntersectionObserver = mockIntersectionObserver;
});

test('Stuff', async () => {
  const { container } = render(<Stuff />);

  expect(container).toMatchSnapshot();

  // add group
  {
    expect(screen.queryAllByTestId('group-card')).toHaveLength(0);
    act(() => screen.getByText('Add Group').click());
    expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(screen.queryByTestId('save-group-modal')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('group-card')).toHaveLength(1);
  }

  // add item
  {
    act(() => screen.getByText('Add Item').click());
    expect(screen.getByTestId('add-group-item-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 1' } });
      screen.getByText('Add').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(screen.queryByTestId('add-group-item-modal')).not.toBeInTheDocument();
    expect(screen.getByTestId('group-card-items-item').textContent).toEqual('Item 1');
  }

  // edit group
  {
    act(() => screen.getByTestId('group-card-settings').click());
    const groupSettingsModal = screen.getByTestId('group-settings-modal');
    expect(groupSettingsModal).toBeInTheDocument();
    act(() => within(groupSettingsModal).getByText('Edit').click());
    expect(screen.getByTestId('save-group-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Group 1a' } });
      screen.getByTestId('color-picker-option-amber').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(screen.queryByTestId('group-settings-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('save-group-modal')).not.toBeInTheDocument();
  }

  // delete group
  {
    act(() => screen.getByTestId('group-card-settings').click());
    const groupSettingsModal = screen.getByTestId('group-settings-modal');
    expect(groupSettingsModal).toBeInTheDocument();
    act(() => within(groupSettingsModal).getByText('Delete').click());
    act(() => within(groupSettingsModal).getByText('Confirm').click());
    expect(screen.queryByTestId('group-settings-modal')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('group-card')).toHaveLength(0);
  }

  expect(container).toMatchSnapshot();
});
