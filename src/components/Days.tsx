import clsx from 'clsx';

import { Day } from 'types/shared';

const Days = ({ days = [] }: { days: Day[] }) => {
  if (!days.length) return null;

  return (
    <div className="space-x-2">
      {days.length === 7 ? (
        <span>Everyday</span>
      ) : (
        days.map((day) => (
          <span key={day} className={clsx({ 'opacity-25': !days.includes(day) })}>
            {day[0]}
          </span>
        ))
      )}
    </div>
  );
};

export default Days;
