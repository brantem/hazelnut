import { useRef, useEffect, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ListBulletIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';

import Item from 'components/Routine/DateList/Item';

import { useHistoriesStore } from 'lib/stores';
import { daysFromSunday } from 'data/days';

const DateList = () => {
  const listRef = useRef<HTMLDivElement>(null);

  const { dates, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate } = useHistoriesStore((state) => {
    const dates = state.histories.reduce((dates, history) => {
      return dates.indexOf(history.date) === -1 ? [...dates, history.date] : dates;
    }, [] as string[]);

    const currentMonth = dayjs().startOf('month').format('YYYY-MM');
    const currentDate = dayjs().startOf('day').toISOString();
    if (state.selectedMonth === currentMonth && dates.indexOf(currentDate) === -1) dates.push(currentDate);

    return {
      dates,
      selectedMonth: state.selectedMonth,
      setSelectedMonth: state.setSelectedMonth,
      selectedDate: state.selectedDate,
      setSelectedDate: state.setSelectedDate,
    };
  });

  /* c8 ignore start */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollLeft = listRef.current.scrollWidth;

    const selected = document.querySelector('[aria-selected="true"]');
    if (selected) selected.scrollIntoView({ inline: 'start' });
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollLeft = listRef.current.scrollWidth;
  }, [selectedMonth]);
  /* c8 ignore stop */

  const prevMonth = useMemo(() => {
    const value = dayjs(selectedMonth).startOf('month').subtract(1, 'month');
    return { label: value.format(dayjs().isSame(value, 'year') ? 'MMM' : 'MMM YYYY'), value: value.format('YYYY-MM') };
  }, [selectedMonth]);

  const nextMonth = useMemo(() => {
    if (selectedMonth === dayjs().format('YYYY-MM')) return null;
    const value = dayjs(selectedMonth).startOf('month').add(1, 'month');
    return { label: value.format(dayjs().isSame(value, 'year') ? 'MMM' : 'MMM YYYY'), value: value.format('YYYY-MM') };
  }, [selectedMonth]);

  return (
    <section
      className="sticky top-0 z-10 flex w-full flex-1 items-stretch justify-end bg-white dark:bg-black"
      data-testid="date-list"
    >
      <div className="flex items-center space-x-4 overflow-x-auto px-4" ref={listRef}>
        {dates.length > 0 && (
          <Item
            label={prevMonth.label}
            onSelect={() => setSelectedMonth(prevMonth.value)}
            data-testid="date-list-previous-month"
            className={prevMonth.label.length === 3 ? '!mr-4' : ''}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Item>
        )}

        {dates.map((date) => {
          const day = daysFromSunday[dayjs(date).day()]
            .slice(0, 3)
            .toLowerCase()
            .replace(/^(\w{1})/, (match) => match.toUpperCase());
          return (
            <Item
              key={date}
              label={day}
              isSelected={selectedDate === date}
              onSelect={() => setSelectedDate(date)}
              data-testid="date-list-item"
            >
              {dayjs(date).date()}
            </Item>
          );
        })}

        {nextMonth && (
          <Item
            label={nextMonth.label}
            onSelect={() => setSelectedMonth(nextMonth.value)}
            data-testid="date-list-next-month"
            className="!ml-8"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Item>
        )}
      </div>

      {dates.length > 0 && <div className="relative mr-4 mb-3 border-l dark:border-l-neutral-800" />}

      <Item
        className="mr-4"
        label="List"
        isSelected={!selectedDate}
        onSelect={() => setSelectedDate(null)}
        data-testid="date-list-action"
      >
        <ListBulletIcon className="h-5 w-5" />
      </Item>
    </section>
  );
};

export default DateList;
