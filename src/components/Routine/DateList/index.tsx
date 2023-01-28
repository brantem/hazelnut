import { useRef, useEffect } from 'react';
import { ListBulletIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';

import Item, { ItemProps } from 'components/Routine/DateList/Item';

import { useHistoriesStore } from 'lib/stores';
import { daysFromSunday } from 'data/days';

type DateItemProps = Pick<ItemProps, 'isSelected'> & {
  date: string;
};

const DateItem = ({ date, isSelected }: DateItemProps) => {
  const setSelectedDate = useHistoriesStore((state) => state.setSelectedDate);
  const day = daysFromSunday[dayjs(date).day()]
    .slice(0, 3)
    .toLowerCase()
    .replace(/^(\w{1})/, (match) => match.toUpperCase());

  return (
    <Item label={day} isSelected={isSelected} onSelected={() => setSelectedDate(date)} data-testid="date-list-item">
      {dayjs(date).date()}
    </Item>
  );
};

const DateList = () => {
  const listRef = useRef<HTMLDivElement>(null);

  const { dates, selectedMonth, selectedDate, setSelectedDate, cleanup } = useHistoriesStore((state) => {
    const dates = state.histories
      .reduce((dates, history) => {
        const date = dayjs(history.date).startOf('day').toISOString();
        return dates.indexOf(date) === -1 ? [...dates, date] : dates;
      }, [] as string[])
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return {
      dates,
      selectedMonth: state.selectedMonth,
      selectedDate: state.selectedDate,
      setSelectedDate: state.setSelectedDate,
      cleanup: () => {
        state.setSelectedMonth(dayjs().format('YYYY-MM'));
        state.setSelectedDate(null);
      },
    };
  });

  /* c8 ignore start */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollLeft = listRef.current.scrollWidth;

    const selected = document.querySelector('[aria-selected="true"]');
    if (selected) selected.scrollIntoView({ inline: 'start' });

    return cleanup;
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollLeft = listRef.current.scrollWidth;
  }, [selectedMonth]);
  /* c8 ignore stop */

  return (
    <section
      className="sticky top-0 z-10 flex w-full flex-1 items-stretch justify-end bg-white dark:bg-neutral-900"
      data-testid="date-list"
    >
      <div className="flex scroll-pl-4 space-x-4 overflow-x-auto px-4" ref={listRef}>
        {dates.map((date) => {
          const isSelected = selectedDate === date;
          return <DateItem key={date} date={date} isSelected={isSelected} />;
        })}
      </div>

      {dates.length > 0 && <div className="relative mr-4 mb-3 border-l dark:border-l-neutral-800" />}

      <Item
        className="mr-4"
        label="List"
        isSelected={!selectedDate}
        onSelected={() => setSelectedDate(null)}
        data-testid="date-list-action"
      >
        <ListBulletIcon className="h-5 w-5" />
      </Item>
    </section>
  );
};

export default DateList;
