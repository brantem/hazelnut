import { render, screen, act, fireEvent, waitFor, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveItemModal from 'components/modals/SaveItemModal';

import { useModalStore } from 'lib/stores';
import { Item, ItemType } from 'types/item';
import * as constants from 'data/constants';

const item: Item = {
  id: 'item-1',
  groupId: 'group-1',
  title: 'Item 1',
  createdAt: 0,
};

describe('SaveItemModal', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should open edit item modal', () => {
    const modal = renderHook(() => useModalStore());

    render(<SaveItemModal modalKey={constants.modals.saveItem} item={item} onSave={() => {}} />);

    expect(screen.queryByTestId('save-item-modal')).not.toBeInTheDocument();
    act(() => modal.result.current.show(constants.modals.saveItem));
    expect(screen.getByTestId('save-item-modal')).toBeInTheDocument();
  });

  it('should add bool item', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const onSave = vi.fn();
    render(<SaveItemModal modalKey={constants.modals.saveItem} onSave={onSave} />);

    act(() => modal.result.current.show(constants.modals.saveItem));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Item 1 ' } });
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: ItemType.Bool } });
    act(() => screen.getByText('Add').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1', type: ItemType.Bool, settings: {} };
    expect(onSave).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalledWith();
  });

  it('should add number item', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const onSave = vi.fn();
    render(<SaveItemModal modalKey={constants.modals.saveItem} onSave={onSave} />);

    act(() => modal.result.current.show(constants.modals.saveItem));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Item 2' } });
    expect(screen.queryByLabelText('Min Completed')).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: ItemType.Number } });

    const minCompleted = screen.getByLabelText<HTMLInputElement>('Min Completed');
    expect(minCompleted.value).toEqual('0');
    fireEvent.change(minCompleted, { target: { value: '2' } });
    expect(minCompleted.value).toEqual('2');

    const step = screen.getByLabelText<HTMLInputElement>('Step');
    expect(step.value).toEqual('1');
    fireEvent.change(step, { target: { value: '2' } });
    expect(step.value).toEqual('2');

    act(() => screen.getByText('Add').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 2', type: ItemType.Number, settings: { minCompleted: 2, step: 2 } };
    expect(onSave).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalledWith();
  });

  it('should edit existing item', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const onSave = vi.fn();
    render(<SaveItemModal modalKey={constants.modals.saveItem} item={item} onSave={onSave} />);

    act(() => modal.result.current.show(constants.modals.saveItem));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: ' Item 1a ' } });
    act(() => screen.getByText('Save').click());
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    const values = { title: 'Item 1a', type: ItemType.Bool, settings: {} };
    expect(onSave).toHaveBeenCalledWith(values);
    expect(hide).toHaveBeenCalled();
  });
});
