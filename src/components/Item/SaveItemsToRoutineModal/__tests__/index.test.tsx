import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import SaveItemsToRoutineModal from 'components/Item/SaveItemsToRoutineModal';

import { useGroupsStore, useItemsStore, useModalStore, useRoutinesStore } from 'lib/stores';
import { Routine } from 'types/routine';
import { Group } from 'types/group';
import { Item } from 'types/item';
import * as constants from 'data/constants';

const routine: Routine = {
  id: 'routine-1',
  title: 'Routine 1',
  color: 'red',
  days: ['MONDAY'],
  time: '00:00',
  itemIds: ['item-0'],
  minimized: false,
};

describe('SaveItemsToRoutineModal', () => {
  beforeAll(() => {
    const groups = renderHook(() => useGroupsStore());
    act(() => {
      groups.result.current.add({ id: 'group-1', title: 'Group 1', color: 'red' } as Group);
      groups.result.current.add({ id: 'group-2', title: 'Group 2', color: 'red' } as Group);
    });

    const items = renderHook(() => useItemsStore());
    act(() => {
      items.result.current.add('group-1', { id: 'item-1', title: 'Item 1' } as Item);
      items.result.current.add('group-2', { id: 'item-2', title: 'Item 2' } as Item);
    });
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({ observe: () => null, unobserve: () => null, disconnect: () => null });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should add item to routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit').mockImplementation(() => {});

    render(<SaveItemsToRoutineModal />);
    act(() => {
      result.current.setRoutine(routine);
      modal.result.current.show(constants.modals.saveItemsToRoutine);
    });
    expect(screen.getByLabelText('Item 1')).toHaveAttribute('aria-checked', 'false');
    act(() => {
      screen.getByText('Item 1').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(edit).toHaveBeenCalledWith('routine-1', { itemIds: ['item-1'] });
    expect(hide).toHaveBeenCalled();
  });

  it('should remove item to routine', async () => {
    const modal = renderHook(() => useModalStore());
    const hide = vi.spyOn(modal.result.current, 'hide');

    const { result } = renderHook(() => useRoutinesStore());
    const edit = vi.spyOn(result.current, 'edit').mockImplementation(() => {});

    render(<SaveItemsToRoutineModal />);
    act(() => {
      result.current.setRoutine({ ...routine, itemIds: ['item-1'] });
      modal.result.current.show(constants.modals.saveItemsToRoutine);
    });
    expect(screen.getByLabelText('Item 1')).toHaveAttribute('aria-checked', 'true');
    act(() => {
      screen.getByText('Item 1').click();
      screen.getByText('Save').click();
    });
    await waitFor(() => new Promise((res) => setTimeout(res, 0)));
    expect(edit).toHaveBeenCalledWith('routine-1', { itemIds: [] });
    expect(hide).toHaveBeenCalled();
  });
});
