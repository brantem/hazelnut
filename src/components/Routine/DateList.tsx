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
    <li
      className="flex-shrink-0 cursor-pointer"
      onClick={() => setSelectedDate(date)}
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && setSelectedDate(date)}
      data-testid="date-list-item"
    >
      <div className="flex flex-col items-center justify-center" aria-selected={isSelected ? 'true' : 'false'}>
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
    </li>
  );
};

const DateList = () => {
  const { dates, selectedDate, setSelectedDate } = useHistoriesStore((state) => {
    const dates = state.histories
      .reduce((dates, history) => {
        const date = dayjs(history.date).startOf('day').toISOString();
        return dates.indexOf(date) === -1 ? [...dates, date] : dates;
      }, [] as string[])
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return { dates, selectedDate: state.selectedDate, setSelectedDate: state.setSelectedDate };
  });

  const isReady = selectedDate !== undefined;
  useEffect(() => {
    if (!isReady) return;
    document.querySelector('[aria-selected="true"]')?.scrollIntoView();
  }, [isReady]);

  return (
    <section className="sticky top-0 z-10 w-full flex-1 bg-white" data-testid="date-list">
      {!isReady ? (
        <div className="mb-3 h-16" />
      ) : (
        <ol
          className="flex scroll-pl-4 space-x-7 space-x-reverse overflow-x-auto px-4 pb-3"
          style={{ direction: 'rtl' }}
        >
          <li
            className="flex-shrink-0 cursor-pointer"
            onClick={() => setSelectedDate(null)}
            tabIndex={0}
            onKeyDown={(e) => e.code === 'Space' && setSelectedDate(null)}
            data-testid="date-list-routine"
          >
            <div className="flex flex-col items-center justify-center" aria-selected={!selectedDate ? 'true' : 'false'}>
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
          </li>

          {dates.length ? <li className="!mr-4 !-ml-3 border-l" /> : null}

          {dates.map((date) => {
            const isSelected = selectedDate === date;
            return <DateListItem key={date} date={date} isSelected={isSelected} />;
          })}
        </ol>
      )}
    </section>
  );
};

export default DateList;
