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
