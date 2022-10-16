import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useGroupsStore } from 'lib/stores';
import storage from 'lib/stores/storage';
import colors from 'data/colors';

const generateGroup = (i: number) => {
  return {
    id: 'group-' + i,
    title: 'Group ' + i,
    color: colors[i - 1],
    minimized: true,
    createdAt: 0,
  };
};

describe('useGroupsStore', () => {
  it('should set group', async () => {
    const { result } = renderHook(() => useGroupsStore());
    await act(() => result.current.setGroup(generateGroup(1)));
    expect(result.current.group).toEqual(generateGroup(1));
    await act(() => result.current.setGroup(null));
    expect(result.current.group).toBeNull();
  });

  it('should add group', () => {
    const add = vi.spyOn(storage, 'add');

    const { result } = renderHook(() => useGroupsStore());
    expect(result.current.groups).toHaveLength(0);
    act(() => {
      result.current.add(generateGroup(1));
      result.current.add(generateGroup(2));
    });
    expect(result.current.groups).toEqual([generateGroup(1), generateGroup(2)]);
    expect(add).toHaveBeenCalledWith('groups', generateGroup(1));
    expect(add).toHaveBeenCalledWith('groups', generateGroup(2));
  });

  it(`should cancel when trying to update group that doesn't exist`, async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useGroupsStore());
    const values = { title: 'Group 1a', color: 'orange', minimized: true };
    await act(() => result.current.edit('group-1a', values));
    expect(result.current.groups).toEqual([generateGroup(1), generateGroup(2)]);
    expect(put).not.toHaveBeenCalled();
  });

  it('should edit group', async () => {
    const put = vi.spyOn(storage, 'put');

    const { result } = renderHook(() => useGroupsStore());
    const values = { title: 'Group 1a', color: 'orange', minimized: true };
    await act(() => result.current.edit('group-1', values));
    expect(result.current.groups).toEqual([{ ...generateGroup(1), ...values }, generateGroup(2)]);
    expect(put).toHaveBeenCalledWith('groups', { ...generateGroup(1), ...values });
  });

  it('should remove group', async () => {
    const _delete = vi.spyOn(storage, 'delete');

    const { result } = renderHook(() => useGroupsStore());
    await act(() => result.current.remove('group-1'));
    expect(result.current.groups).toEqual([generateGroup(2)]);
    expect(_delete).toHaveBeenCalledWith('groups', 'group-1');
  });
});
