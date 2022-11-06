import { useEffect } from 'react';
import clsx from 'clsx';
import { ListBulletIcon } from '@heroicons/react/20/solid';

import dayjs from 'dayjs';

import { useHistoriesStore } from 'lib/stores';
import { daysFromSunday } from 'data/days';

type DateListItem = {
  date: string;
  isSelected: boolean;
};

const DateListItem = ({ date, isSelected }: DateListItem) => {
  const setSelectedDate = useHistoriesStore((state) => state.setSelectedDate);
  const day = daysFromSunday[dayjs(date).day()]
    .slice(0, 3)
    .toLowerCase()
    .replace(/^(\w{1})/, (match) => match.toUpperCase());

  return (
    <div
      className="flex flex-shrink-0 cursor-pointer flex-col items-center justify-center"
      onClick={() => setSelectedDate(date)}
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && setSelectedDate(date)}
      data-testid="date-list-item"
      aria-selected={isSelected ? 'true' : 'false'}
    >
      <span
        className={clsx(
          `flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100`,
          isSelected && 'border-black bg-black text-white',
        )}
      >
        {dayjs(date).date()}
      </span>
      <span className="mt-1 text-sm">{day}</span>
    </div>
  );
};

const DateList = () => {
  const { dates, selectedDate, setSelectedDate } = useHistoriesStore((state) => {
    const dates = state.histories
      .reduce((dates, history) => {
        const date = dayjs(history.date).startOf('day').toISOString();
        return dates.indexOf(date) === -1 ? [...dates, date] : dates;
      }, [] as string[])
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return { dates, selectedDate: state.selectedDate, setSelectedDate: state.setSelectedDate };
  });

  const isReady = selectedDate !== undefined;
  useEffect(() => {
    if (!isReady) return;
    document.querySelector('[aria-selected="true"]')?.scrollIntoView();
  }, [isReady]);

  return (
    <section
      className="sticky top-0 z-10 flex w-full flex-1 items-stretch justify-end bg-white"
      data-testid="date-list"
    >
      <div className="flex scroll-pl-4 space-x-4 overflow-x-auto px-4 pb-3">
        {dates.map((date) => {
          const isSelected = selectedDate === date;
          return <DateListItem key={date} date={date} isSelected={isSelected} />;
        })}
      </div>

      {dates.length ? <div className="relative mr-4 mb-3 border-l" /> : null}

      <div
        className="mr-4 mb-3 flex flex-shrink-0 cursor-pointer flex-col items-center justify-center"
        onClick={() => setSelectedDate(null)}
        tabIndex={0}
        onKeyDown={(e) => e.code === 'Space' && setSelectedDate(null)}
        data-testid="date-list-action"
        aria-selected={isReady && !selectedDate ? 'true' : 'false'}
      >
        <span
          className={clsx(
            `flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100`,
            !selectedDate && 'border-black bg-black text-white',
          )}
        >
          <ListBulletIcon className="h-5 w-5" />
        </span>
        <span className="mt-1 text-sm">List</span>
      </div>
    </section>
  );
};

export default DateList;
