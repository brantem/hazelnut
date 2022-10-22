import pick from 'just-pick';
import omit from 'just-omit';
import dayjs from 'dayjs';

import { daysFromSunday } from 'data/days';
import { Day, Recurrence } from 'types/shared';

/* c8 ignore next */
export { pick, omit }; // hack to fix swc minify bug

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

export const getNextDate = (recurrence: Recurrence) => {
  if (!recurrence.interval) return '-';

  let startAt = dayjs(recurrence.startAt);
  const now = dayjs();
  if (startAt < now) startAt = now;

  switch (recurrence.frequency) {
    case 'DAILY':
      return startAt.startOf('day').add(recurrence.interval, 'day').format('D MMM YYYY');
    case 'WEEKLY': {
      const day = [...recurrence.days].sort((a, b) => daysFromSunday.indexOf(a) - daysFromSunday.indexOf(b))[0];
      const i = startAt.get('day');
      const j = daysFromSunday.indexOf(day);
      if (j > i) return startAt.add(j - i, 'day').format('D MMM YYYY');
      return startAt.add(recurrence.interval * 7 - i + j, 'day').format('D MMM YYYY');
    }
  }
};
