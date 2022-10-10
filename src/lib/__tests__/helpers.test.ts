import { sortRoutines, getCurrentDay, getMinutesFromTime, isMatch } from 'lib/helpers';
import { Routine } from 'types/routine';

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
});

test('sortRoutines', () => {
  console.log(sortRoutines([generateRoutine(1, '01:00'), generateRoutine(2, null)]));
  expect(sortRoutines([generateRoutine(1, '01:00'), generateRoutine(2, null)])).toEqual([
    generateRoutine(2, null),
    generateRoutine(1, '01:00'),
  ]);
  expect(sortRoutines([generateRoutine(1, '02:00'), generateRoutine(2, '01:00')])).toEqual([
    generateRoutine(2, '01:00'),
    generateRoutine(1, '02:00'),
  ]);
});
