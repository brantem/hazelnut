import _pick from 'just-pick';

import days from 'data/days';
import { Day } from 'types/shared';

export const getMinutesFromTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return parseInt(hour) * 60 + parseInt(minute);
};

export const getCurrentDay = (): Day => [...days.slice(6), ...days.slice(0, -1)][new Date().getDay()];

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

// export const pick = <T, U extends keyof T>(obj: T, select: U[]) => {
//   const result = {} as Pick<T, U>;
//   for (let i = 0; i < select.length; i++) {
//     const key = select[i];
//     if (key in obj) result[key] = obj[key];
//   }
//   return result;
// };

export const pick = _pick;
