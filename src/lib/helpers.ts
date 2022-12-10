import pick from 'just-pick';
import omit from 'just-omit';
import capitalize from 'just-capitalize';
import dayjs from 'dayjs';

import { daysFromSunday } from 'data/days';
import { Day, Recurrence } from 'types/shared';
import { Routine } from 'types/routine';

/* c8 ignore next */
export { pick, omit, capitalize }; // hack to fix swc minify bug

export const getMinutesFromTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return parseInt(hour) * 60 + parseInt(minute);
};

export const getCurrentDay = (): Day => daysFromSunday[new Date().getDay()];

export const isMatch = (s1: string, s2: string) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  if (!s2.includes(' ')) return s1.includes(s2);
  return s2.split(/\s*/).every((s) => s1.includes(s));
};

export const sortRoutines = <T extends { time: string | null }>(routines: T[]) => {
  if (!routines.length) return [];

  const withTime: T[] = [];
  const withoutTime: T[] = [];
  for (let i = 0; i < routines.length; i++) {
    if (routines[i].time) {
      withTime.push(routines[i]);
    } else {
      withoutTime.push(routines[i]);
    }
  }

  return withoutTime.concat(withTime.sort((a, b) => getMinutesFromTime(a.time!) - getMinutesFromTime(b.time!)));
};

export const sortDays = (days: Day[]) => {
  if (!days.length) return [];
  return [...days].sort((a, b) => daysFromSunday.indexOf(a) - daysFromSunday.indexOf(b));
};

export const getNextDate = (recurrence: Recurrence) => {
  if (!recurrence.interval) return '-';

  let startAt = dayjs(recurrence.startAt);
  const now = dayjs();
  if (startAt < now) startAt = now;

  switch (recurrence.frequency) {
    case 'DAILY':
      return startAt.startOf('day').add(recurrence.interval, 'day').format('D MMM YYYY');
    case 'WEEKLY': {
      const day = sortDays(recurrence.days)[0];
      const i = startAt.get('day');
      const j = daysFromSunday.indexOf(day);
      if (j > i) return startAt.add(j - i, 'day').format('D MMM YYYY');
      return startAt.add(recurrence.interval * 7 - i + j, 'day').format('D MMM YYYY');
    }
  }
};

export const isRoutineActive = (routine: Routine) => {
  if (routine.recurrence.startAt > Date.now()) return false;
  const day = getCurrentDay();
  const startAt = dayjs(routine.recurrence.startAt);
  switch (routine.recurrence.frequency) {
    case 'DAILY':
      return dayjs().diff(startAt, 'day') % routine.recurrence.interval === 0;
    case 'WEEKLY':
      return dayjs().diff(startAt, 'week') % routine.recurrence.interval === 0 && routine.recurrence.days.includes(day);
  }
};

export const getNumberInputShade = (minCompleted: number, value: number) => {
  if (minCompleted === 0 || value === 0) return 0;
  const i = Math.round(value / (minCompleted / 5)) - 1;
  return [100, 200, 300, 400, 500][i > 4 ? 4 : i];
};
