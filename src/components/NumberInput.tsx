import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type NumberInputProps = {
  label?: string;
  color?: string;
  value: number;
  renderValue?: (value: number) => React.ReactNode;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};
const NumberInput = ({
  label,
  color = 'mono',
  value = 0,
  renderValue,
  onChange,
  min = 0,
  max,
  step = 1,
  className,
}: NumberInputProps) => {
  return (
    <div className="flex w-full items-center justify-between space-x-3">
      {label && <label className="flex-1 truncate font-medium">{label}</label>}

      <div className="!-mr-0.5 flex items-center space-x-1">
        <button
          type="button"
          className={`rounded-full disabled:opacity-50 text-${color}-600`}
          onClick={() => onChange(value - step)}
          disabled={value === min}
          data-testid="number-input-decrement"
        >
          <MinusCircleIcon className="h-6 w-6" />
        </button>

        <span
          className={clsx(`px-1.5 text-center text-sm tabular-nums text-${color}-600 rounded-full`, className)}
          data-testid="number-input-value"
        >
          {renderValue ? renderValue(value) : value}
        </span>

        <button
          type="button"
          className={`rounded-full disabled:opacity-50 text-${color}-600`}
          onClick={() => onChange(value + step)}
          disabled={Boolean(max && value >= max)}
          data-testid="number-input-increment"
        >
          <PlusCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
