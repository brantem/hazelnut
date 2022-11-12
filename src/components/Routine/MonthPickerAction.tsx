import { useRef } from 'react';
import dayjs from 'dayjs';

import Button from 'components/Button';

import { useHistoriesStore } from 'lib/stores';

const MonthPickerAction = () => {
  const { selectedMonth, setSelectedMonth } = useHistoriesStore((state) => ({
    selectedMonth: dayjs(state.selectedMonth),
    setSelectedMonth: state.setSelectedMonth,
  }));
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        data-testid="month-action-input"
        type="month"
        value={selectedMonth.format('YYYY-MM')}
        max={dayjs().format('YYYY-MM')}
        onChange={(e) => setSelectedMonth(e.target.value)}
        ref={inputRef}
        className="sr-only"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => /* c8 ignore next */ inputRef.current?.showPicker()}
        data-testid="month-action-button"
      >
        {dayjs().isSame(selectedMonth, 'year') ? selectedMonth.format('MMM') : selectedMonth.format('MMM YYYY')}
      </Button>
    </div>
  );
};

export default MonthPickerAction;
