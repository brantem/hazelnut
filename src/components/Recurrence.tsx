import { useMemo } from 'react';
import dayjs from 'dayjs';

import Input from 'components/Input';

type Value = {
  startAt: number;
  interval: number;
};

type RecurrenceProps = {
  value: Value;
  onChange: (value: Value) => void;
  isDisabled?: boolean;
  showNext?: boolean;
};

const Recurrence = ({ value, onChange, isDisabled, showNext }: RecurrenceProps) => {
  const next = useMemo(() => {
    if (!value.interval) return '-';
    let startAt = value.startAt;
    const now = Date.now();
    if (startAt < now) startAt = now;
    return dayjs(startAt).startOf('day').add(value.interval, 'day').format('D MMM YYYY');
  }, [value.startAt, value.interval]);

  return (
    <div data-testid="repeat-every">
      <div className="flex w-full items-center space-x-3">
        <span className="flex-shrink-0 text-sm">From</span>
        <Input
          type="date"
          name="recurrence.startAt"
          value={dayjs(value.startAt).format('YYYY-MM-DD')}
          onChange={(e) => onChange({ ...value, startAt: dayjs(e.target.value).startOf('day').valueOf() })}
          disabled={isDisabled}
          className="text-sm"
          required
        />
        <span className="flex-shrink-0 text-sm">repeat every</span>
        <div className="w-14">
          <Input
            type="number"
            name="recurrence.interval"
            value={value.interval || ''}
            onChange={(e) => onChange({ ...value, interval: parseInt(e.target.value) })}
            disabled={isDisabled}
            min="1"
            className="text-center text-sm"
            required
          />
        </div>
        <span className="flex-shrink-0 text-sm">day(s)</span>
      </div>

      {showNext && <p className="mt-2 text-sm text-neutral-500">Next: {next}</p>}
    </div>
  );
};

export default Recurrence;
