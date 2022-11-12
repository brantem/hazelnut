import { useRef, useEffect, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ListBulletIcon } from '@heroicons/react/20/solid';
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

  const { selectedMonth, setSelectedMonth, dates, selectedDate, setSelectedDate } = useHistoriesStore((state) => {
    const dates = state.histories
      .reduce((dates, history) => {
        const date = dayjs(history.date).startOf('day').toISOString();
        return dates.indexOf(date) === -1 ? [...dates, date] : dates;
      }, [] as string[])
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return {
      selectedMonth: state.selectedMonth,
      setSelectedMonth: state.setSelectedMonth,
      dates,
      selectedDate: state.selectedDate,
      setSelectedDate: state.setSelectedDate,
    };
  });

  const isReady = selectedDate !== undefined;
  useEffect(() => {
    /* c8 ignore start */
    if (!isReady) return;
    const selected = document.querySelector('[aria-selected="true"]');
    if (!selected) return;
    if (selected.getAttribute('id') === 'date-list-action') {
      if (!listRef.current) return;
      listRef.current.scrollLeft = listRef.current.scrollWidth;
    } else {
      selected.scrollIntoView({ inline: 'start' });
    }
    /* c8 ignore stop */
  }, [isReady]);

  const prevMonth = useMemo(() => {
    const value = dayjs(selectedMonth).startOf('month').subtract(1, 'month');
    return { label: value.format(dayjs().isSame(value, 'year') ? 'MMM' : 'MMM YYYY'), value: value.toISOString() };
  }, [selectedMonth]);

  const nextMonth = useMemo(() => {
    if (!selectedMonth) return null;
    const value = dayjs(selectedMonth).startOf('month').add(1, 'month');
    if (dayjs().isSame(value, 'month')) return { label: value.format('MMM'), value: undefined };
    return { label: value.format(dayjs().isSame(value, 'year') ? 'MMM' : 'MMM YYYY'), value: value.toISOString() };
  }, [selectedMonth]);

  return (
    <section
      className="sticky top-0 z-10 flex w-full flex-1 items-stretch justify-end bg-white"
      data-testid="date-list"
    >
      <div className="flex scroll-pl-4 space-x-4 overflow-x-auto px-4" ref={listRef}>
        {dates.length > 0 && (
          <>
            <Item
              label={prevMonth.label}
              onSelected={() => setSelectedMonth(prevMonth.value)}
              data-testid="date-list-previous-month"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Item>

            <div className="relative mr-4 mb-3 border-l" />
          </>
        )}

        {dates.map((date) => {
          const isSelected = selectedDate === date;
          return <DateItem key={date} date={date} isSelected={isSelected} />;
        })}

        {nextMonth && (
          <>
            {dates.length > 0 && <div className="relative mr-4 mb-3 border-l" />}

            <Item
              label={nextMonth.label}
              onSelected={() => setSelectedMonth(nextMonth.value)}
              data-testid="date-list-next-month"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </Item>
          </>
        )}
      </div>

      {dates.length > 0 && <div className="relative mr-4 mb-3 border-l" />}

      <Item
        className="mr-4"
        label="List"
        isSelected={isReady && !selectedDate}
        onSelected={() => setSelectedDate(null)}
        data-testid="date-list-action"
      >
        <ListBulletIcon className="h-5 w-5" />
      </Item>
    </section>
  );
};

export default DateList;
