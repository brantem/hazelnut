import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';

import days from 'data/days';
import { Day as _Day } from 'types/shared';
import { sortDays } from 'lib/helpers';

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
  label?: string;
  value: _Day[];
  onChange: (days: _Day[]) => void;
  isDisabled?: boolean;
};

const DayPicker = ({ label = 'Day(s)', value, onChange, isDisabled }: DayPickerProps) => {
  return (
    <div data-testid="day-picker">
      {label && <label className="mb-1 block text-sm text-neutral-700">{label}</label>}

      <div className="mt-2 flex items-center justify-between">
        {days.map((day) => (
          <Day
            key={day}
            day={day}
            isSelected={value.includes(day)}
            onChange={(e) =>
              onChange(e.target.checked ? sortDays([...value, day]) : value.filter((_day) => _day !== day))
            }
            isDisabled={isDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export default DayPicker;
