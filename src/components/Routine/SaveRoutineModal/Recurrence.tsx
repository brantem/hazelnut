import dayjs from 'dayjs';

import Input from 'components/Input';
import DayPicker from 'components/DayPicker';

import { Frequency, Recurrence as Value } from 'types/shared';
import { getCurrentDay, getNextDate } from 'lib/helpers';

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
        <span className="flex-shrink-0 text-sm">From</span>
        <Input
          type="date"
          data-testid="recurrence-startAt"
          name="recurrence.startAt"
          value={dayjs(value.startAt).format('YYYY-MM-DD')}
          onChange={(e) => {
            const startAt = e.target.value ? dayjs(e.target.value) : dayjs();
            onChange({ ...value, startAt: startAt.startOf('day').valueOf() });
          }}
          disabled={isDisabled}
          className="text-sm"
          required
        />
        <span className="flex-shrink-0 text-sm">repeat every</span>
        <div className="w-14 flex-shrink-0">
          <Input
            type="number"
            data-testid="recurrence-interval"
            name="recurrence.interval"
            value={value.interval || ''}
            onChange={(e) => onChange({ ...value, interval: parseInt(e.target.value) })}
            disabled={isDisabled}
            min="1"
            className="text-center text-sm"
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
          className="block h-10 w-24 rounded-md border-neutral-300 bg-white text-sm focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500"
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
