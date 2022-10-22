export type Navigation = {
  icon: React.ReactNode;
  href: string;
  text: string;
};

export type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Frequency = 'DAILY' | 'WEEKLY';

export type Recurrence = {
  startAt: number;
  interval: number;
  frequency: Frequency;
  days: Day[];
};
