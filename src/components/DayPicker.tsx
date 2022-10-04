import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';

import days from 'data/days';

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
        'rounded-full text-center h-10 w-10 flex items-center justify-center border focus-visible:ring-2 ring-neutral-500 ring-offset-2 focus-visible:outline-none',
        {
          'bg-black border-black': isSelected,
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
  value: string[];
  onChange: (days: string[]) => void;
  isDisabled?: boolean;
};

const DayPicker = ({ value, onChange, isDisabled }: DayPickerProps) => {
  return (
    <div data-testid="day-picker">
      <label className="block text-sm font-medium text-neutral-700">Day(s)</label>

      <div className="flex justify-between items-center mt-2">
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
    </div>
  );
};

export default DayPicker;
