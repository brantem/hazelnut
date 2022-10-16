import { sortRoutines, getCurrentDay, getMinutesFromTime, isMatch } from 'lib/helpers';
import dayjs from 'dayjs';
import { Routine } from 'types/routine';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(dayjs().startOf('hour').toDate());
});

afterEach(() => {
  vi.useRealTimers();
});

test('getMinutesFromTime', () => {
  expect(getMinutesFromTime('00:00')).toEqual(0);
  expect(getMinutesFromTime('00:01')).toEqual(1);
  expect(getMinutesFromTime('01:00')).toEqual(60);
});

test('getCurrentDay', () => {
  const _Date = Date;
  const DateMock = vi.fn(() => ({ getDay: vi.fn(() => 0) }));
  vi.stubGlobal('Date', DateMock);
  expect(getCurrentDay()).toEqual('SUNDAY');
  vi.stubGlobal('Date', _Date);
});

test('isMatch', () => {
  expect(isMatch('A', 'A')).toBeTruthy();
  expect(isMatch('ab', 'a  b')).toBeTruthy();
});

const generateRoutine = (i: number, time: Routine['time']): Routine => ({
  id: `routine-${i}`,
  title: `Routine ${i}`,
  color: 'red',
  days: [],
  time,
  itemIds: [],
  minimized: false,
  createdAt: 0,
});

test('sortRoutines', () => {
  expect(sortRoutines([generateRoutine(1, '01:00'), generateRoutine(2, null)])).toEqual([
    generateRoutine(2, null),
    generateRoutine(1, '01:00'),
  ]);
  expect(sortRoutines([generateRoutine(1, '02:00'), generateRoutine(2, '01:00')])).toEqual([
    generateRoutine(2, '01:00'),
    generateRoutine(1, '02:00'),
  ]);
});
