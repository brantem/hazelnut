import storage, { migrateFromLocalStorage, getZustandStorage } from 'lib/stores/storage';

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
  expect(removeItem).toHaveBeenCalledWith('items');

  vi.stubGlobal('localStorage', _localStorage);
  vi.stubGlobal('Date', _Date);
});

describe('getZustandStorage', () => {
  it('should return valid storage', async () => {
    const getAll = vi
      .spyOn(storage, 'getAll')
      .mockImplementationOnce(() => Promise.resolve([{ createdAt: 1 }, { createdAt: 0 }] as any[]));
    const _storage = getZustandStorage('items');

    // getItem
    const getItemResult = await _storage.getItem();
    expect(getAll).toHaveBeenCalledWith('items');
    expect(getItemResult).toEqual(JSON.stringify({ state: { items: [{ createdAt: 0 }, { createdAt: 1 }] } }));

    // setItem
    const setItemResult = await _storage.setItem();
    expect(setItemResult).toBeUndefined();

    const removeItemResult = await _storage.removeItem();
    expect(removeItemResult).toBeUndefined();
  });

  it('should not sort', async () => {
    const getAll = vi
      .spyOn(storage, 'getAll')
      .mockImplementationOnce(() => Promise.resolve([{ createdAt: 1 }, { createdAt: 0 }] as any[]));
    const _storage = getZustandStorage('items', false);

    const getItemResult = await _storage.getItem();
    expect(getAll).toHaveBeenCalledWith('items');
    expect(getItemResult).toEqual(JSON.stringify({ state: { items: [{ createdAt: 1 }, { createdAt: 0 }] } }));
  });

  it('should add run custom getItem', async () => {
    const getAll = vi
      .spyOn(storage, 'getAll')
      .mockImplementationOnce(() => Promise.resolve([{ createdAt: 1 }, { createdAt: 0 }] as any[]));
    const _storage = getZustandStorage('items', true, { getItem: () => ({ a: 1 }) });

    const getItemResult = await _storage.getItem();
    expect(getAll).toHaveBeenCalledWith('items');
    expect(getItemResult).toEqual(JSON.stringify({ state: { items: [{ createdAt: 0 }, { createdAt: 1 }], a: 1 } }));
  });
});
