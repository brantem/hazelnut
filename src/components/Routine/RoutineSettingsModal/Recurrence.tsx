import { Recurrence as _Recurrence } from 'types/shared';
import { sortDays, capitalize } from 'lib/helpers';

const Recurrence = ({ recurrence }: { recurrence: _Recurrence }) => {
  switch (recurrence.frequency) {
    case 'DAILY':
      if (recurrence.interval === 1) return <span data-testid="routine-settings-modal-recurrence">Daily</span>;
      return <span data-testid="routine-settings-modal-recurrence">Every {recurrence.interval} days</span>;
    case 'WEEKLY': {
      const days = sortDays(recurrence.days).map((day) => capitalize(day));
      return (
        <span data-testid="routine-settings-modal-recurrence">
          {recurrence.interval > 1 ? (
            <>
              Every <strong>{recurrence.interval} weeks</strong> on
            </>
          ) : (
            <>
              <strong>Weekly</strong> on
            </>
          )}{' '}
          <strong>
            {recurrence.days.length === 7
              ? 'all days'
              : days.length > 1
              ? days.slice(0, -1).join(', ') + ' & ' + days.slice(-1)
              : days[0]}
          </strong>
        </span>
      );
    }
  }
};

export default Recurrence;
