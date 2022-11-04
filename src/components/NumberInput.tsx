import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type NumberInputProps = {
  label?: string;
  name: string;
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
};

const NumberInput = ({ label, name, value = 0, onChange, min = 0, max, step = 1, isDisabled }: NumberInputProps) => {
  return (
    <div className="flex w-full items-center justify-between space-x-3">
      {label && (
        <label htmlFor={name} className="flex-1 truncate font-medium">
          {label}
        </label>
      )}

      <div className="flex items-center space-x-1">
        <button
          type="button"
          className="rounded-full disabled:opacity-50"
          onClick={() => onChange(value - step)}
          disabled={isDisabled || value === min}
          data-testid="number-input-decrement"
        >
          <MinusCircleIcon className="h-6 w-6" />
        </button>

        <input
          type="number"
          className={clsx(
            'border-0 bg-transparent p-0 text-center text-sm tabular-nums disabled:text-neutral-500',
            /* c8 ignore next */ value.toString().length > step ? 'w-7' : 'w-5',
          )}
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={isDisabled}
          data-testid="number-input-value"
        />

        <button
          type="button"
          className="rounded-full disabled:opacity-50"
          onClick={() => onChange(value + step)}
          disabled={isDisabled || Boolean(max && value >= max)}
          data-testid="number-input-increment"
        >
          <PlusCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
