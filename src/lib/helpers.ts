import days from 'data/days';
import { Day } from 'types/shared';

export const getMinutesFromTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return parseInt(hour) * 60 + parseInt(minute);
};

export const getCurrentDay = (): Day => [...days.slice(6), ...days.slice(0, -1)][new Date().getDay()];
