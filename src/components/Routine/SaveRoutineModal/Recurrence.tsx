import { useRef } from 'react';
import dayjs from 'dayjs';
import clsx from 'clsx';

import Input from 'components/Input';
import DayPicker from 'components/Routine/SaveRoutineModal/DayPicker';

import { Frequency, Recurrence as Value } from 'types/shared';
import { getCurrentDay, getNextDate } from 'lib/helpers';

type RecurrenceStartAtProps = {
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isDisabled?: boolean;
};

const RecurrenceStartAt = ({ value, onChange, isDisabled }: RecurrenceStartAtProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        data-testid="recurrence-startAt"
        name="recurrence.startAt"
        type="date"
        onChange={onChange}
        disabled={isDisabled}
        ref={inputRef}
        className="sr-only"
      />
      <span
        className={clsx(
          'flex-grow-1 flex-auto flex-shrink-0 rounded-md border border-neutral-300 p-2 text-center text-sm',
          isDisabled && 'border-neutral-200 bg-neutral-100 text-neutral-500',
        )}
        onClick={() => inputRef.current?.showPicker()}
      >
        {dayjs(value).format('D MMM YYYY')}
      </span>
    </>
  );
};

type RecurrenceProps = {
  value: Value;
  onChange: (value: Value) => void;
  isDisabled?: boolean;
  showNext?: boolean;
};

const Recurrence = ({ value, onChange, isDisabled, showNext }: RecurrenceProps) => {
  return (
    <div data-testid="repeat-every" className="space-y-2">
      <div className="flex w-full items-center space-x-3">
        <span className="flex-shrink-0 text-sm text-neutral-700">From</span>

        <RecurrenceStartAt
          value={value.startAt}
          onChange={(e) => {
            const startAt = e.target.value ? dayjs(e.target.value) : dayjs();
            onChange({ ...value, startAt: startAt.startOf('day').valueOf() });
          }}
          isDisabled={isDisabled}
        />

        <span className="flex-shrink-0 text-sm text-neutral-700">repeat every</span>

        <div className="w-10">
          <Input
            type="number"
            data-testid="recurrence-interval"
            name="recurrence.interval"
            value={value.interval || ''}
            onChange={(e) => onChange({ ...value, interval: parseInt(e.target.value) })}
            disabled={isDisabled}
            min="1"
            className="px-2 text-center text-sm"
            required
          />
        </div>

        <select
          data-testid="recurrence-frequency"
          name="recurrence.frequency"
          value={value.frequency}
          onChange={(e) => {
            const frequency = e.target.value as Frequency;
            onChange({
              ...value,
              frequency,
              days: frequency === 'WEEKLY' ? (value.days.length ? value.days : [getCurrentDay()]) : value.days,
            });
          }}
          disabled={isDisabled}
          required
          className="block h-10 w-[94px] rounded-md border-neutral-300 bg-white pl-2 text-sm opacity-100 focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500"
        >
          <option value="DAILY">{value.interval > 1 ? 'days' : 'day'}</option>
          <option value="WEEKLY">{value.interval > 1 ? 'weeks' : 'week'}</option>
        </select>
      </div>

      {value.frequency === 'WEEKLY' && (
        <DayPicker
          label="Repeat on"
          value={value.days}
          onChange={(days) => onChange({ ...value, days: days.length ? days : [getCurrentDay()] })}
          isDisabled={isDisabled}
        />
      )}

      {showNext && (
        <p data-testid="recurrence-next" className="mt-2 text-sm text-neutral-500">
          Next: {getNextDate(value)}
        </p>
      )}
    </div>
  );
};

export default Recurrence;
