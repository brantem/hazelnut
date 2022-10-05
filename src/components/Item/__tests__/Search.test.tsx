import { render, screen, renderHook, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Search from 'components/Item/Search';

import { useItemsStore } from 'lib/stores';

test('Search', async () => {
  const { result } = renderHook(() => useItemsStore());
  const setSearch = vi.spyOn(result.current, 'setSearch');

  render(<Search />);

  fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'a' } });
  expect(setSearch).toBeCalledWith('a');
});
