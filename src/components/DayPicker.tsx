import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';

import days from 'data/days';
import { Day } from 'types/shared';
import { getFirstDateDifferenceFromToday } from 'lib/helpers';

type DayProps = {
  day: string;
  isSelected: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
};

const Day = ({ day, isSelected, isDisabled, onChange }: DayProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <label
      key={day}
      htmlFor={day}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-full border text-center ring-neutral-500 ring-offset-2 focus-visible:outline-none focus-visible:ring-2',
        {
          'border-black bg-black': isSelected,
          'bg-neutral-100': isDisabled,
          'cursor-pointer': !isDisabled,
          'text-white': isSelected,
          'text-neutral-500': isDisabled && !isSelected,
        },
      )}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => !isDisabled && e.code === 'Space' && inputRef.current?.click()}
      data-testid={`day-picker-option-${day.toLowerCase()}`}
      aria-checked={isSelected ? 'true' : 'false'}
    >
      {day[0]}
      <input
        ref={inputRef}
        type="checkbox"
        id={day}
        name={day}
        checked={isSelected}
        onChange={onChange}
        className="sr-only"
        tabIndex={-1}
        disabled={isDisabled}
      />
    </label>
  );
};

type DayPickerProps = {
  value: Day[];
  onChange: (days: Day[]) => void;
  isDisabled?: boolean;
  showNext?: boolean;
};

const DayPicker = ({ value, onChange, isDisabled, showNext }: DayPickerProps) => {
  return (
    <div data-testid="day-picker">
      <label className="block text-sm font-medium text-neutral-700">Day(s)</label>

      <div className="mt-2 flex items-center justify-between">
        {days.map((day) => (
          <Day
            key={day}
            day={day}
            isSelected={value.includes(day)}
            onChange={(e) => onChange(e.target.checked ? [...value, day] : value.filter((_day) => _day !== day))}
            isDisabled={isDisabled}
          />
        ))}
      </div>

      {showNext && (
        <p className="mt-2 text-sm text-neutral-500">
          Next:{' '}
          {value.length
            ? dayjs().startOf('day').add(getFirstDateDifferenceFromToday(value), 'day').format('D MMM')
            : '-'}
        </p>
      )}
    </div>
  );
};

export default DayPicker;
