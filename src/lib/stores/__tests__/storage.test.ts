import { migrateFromLocalStorage } from 'lib/stores/storage';

test('migrateFromLocalStorage', () => {
  const _localStorage = localStorage;
  const getItem = vi.fn(() => '{"state":{"items":[{"id":1}]}}');
  const removeItem = vi.fn();
  vi.stubGlobal('localStorage', { getItem, removeItem });

  const _Date = Date;
  vi.stubGlobal('Date', { now: vi.fn(() => 0) });

  const add = vi.fn();
  migrateFromLocalStorage({ add } as any, 'items');
  expect(getItem).toHaveBeenCalledWith('items');
  expect(add).toHaveBeenCalledWith({ id: 1, createdAt: Date.now() });
  // expect(removeItem).toHaveBeenCalledWith('items');

  vi.stubGlobal('localStorage', _localStorage);
  vi.stubGlobal('Date', _Date);
});
