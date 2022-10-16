import { useMemo } from 'react';
import clsx from 'clsx';

import dayjs from 'dayjs';

import { useHistoriesStore } from 'lib/stores';
import { daysFromSunday } from 'data/days';

type DateProps = {
  date: string;
  isSelected: boolean;
};

const DatesItem = ({ date, isSelected }: DateProps) => {
  const setSelectedDate = useHistoriesStore((state) => state.setSelectedDate);
  const day = daysFromSunday[dayjs(date).day()]
    .slice(0, 3)
    .toLowerCase()
    .replace(/^(\w{1})/, (match) => match.toUpperCase());

  return (
    <li
      className="w-[calc(100%/7)] flex-shrink-0 cursor-pointer"
      onClick={() => setSelectedDate(date)}
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && setSelectedDate(date)}
      data-testid="dates-item"
    >
      <div className="flex flex-col items-center justify-center" aria-selected={isSelected ? 'true' : 'false'}>
        <span
          className={clsx(
            `flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100`,
            isSelected && 'bg-black text-white',
          )}
        >
          {dayjs(date).date()}
        </span>
        <span className="mt-1 text-sm">{day}</span>
      </div>
    </li>
  );
};

const Dates = () => {
  const { dates, selectedDate } = useHistoriesStore((state) => {
    const dates = state.histories
      .reduce((dates, history) => {
        const date = dayjs(history.date).startOf('day').toISOString();
        return dates.indexOf(date) === -1 ? [...dates, date] : dates;
      }, [] as string[])
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return { dates, selectedDate: state.selectedDate };
  });

  const isReady = selectedDate !== undefined;
  const currentDate = useMemo(() => dayjs().startOf('day').toISOString(), []);

  return (
    <section className="px-4 pb-3" data-testid="dates">
      {!isReady ? (
        <div className="h-16" />
      ) : (
        <ol className="flex overflow-x-auto">
          {dates.map((date) => {
            const isSelected = selectedDate ? selectedDate === date : currentDate === date;
            return <DatesItem key={date} date={date} isSelected={isSelected} />;
          })}

          {dates.indexOf(currentDate) === -1 && (
            <DatesItem date={currentDate} isSelected={!selectedDate || selectedDate === currentDate} />
          )}
        </ol>
      )}
    </section>
  );
};

export default Dates;
