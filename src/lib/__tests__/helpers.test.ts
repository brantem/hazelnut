import { getCurrentDay, getMinutesFromTime } from 'lib/helpers';

test('getMinutesFromTime', () => {
  expect(getMinutesFromTime('00:00')).toEqual(0);
  expect(getMinutesFromTime('00:01')).toEqual(1);
  expect(getMinutesFromTime('01:00')).toEqual(60);
});

test('getCurrentDay', () => {
  const DateMock = vi.fn(() => ({ getDay: vi.fn(() => 0) }));
  vi.stubGlobal('Date', DateMock);
  expect(getCurrentDay()).toEqual('SUNDAY');
});
