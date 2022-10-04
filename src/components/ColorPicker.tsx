import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

import colors from 'data/colors';

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  isDisabled?: boolean;
};

const ColorPicker = ({ value, onChange, isDisabled }: ColorPickerProps) => {
  return (
    <RadioGroup value={value} onChange={onChange} data-testid="color-picker">
      <RadioGroup.Label className="block text-sm text-neutral-700">Color</RadioGroup.Label>

      <div className="mt-2 flex w-full justify-between space-x-2">
        {colors.map((color) => {
          const isActive = color === value;
          return (
            <RadioGroup.Option
              value={color}
              key={color}
              className={clsx(
                `h-8 w-full rounded-full ring-offset-2 focus:outline-none md:h-10`,
                isActive && 'ring-2',
                isDisabled ? `bg-${color}-300 ring-neutral-300` : `bg-${color}-500 ring-${color}-500 cursor-pointer`,
              )}
              disabled={isDisabled}
              data-testid={`color-picker-option-${color}`}
            />
          );
        })}
      </div>
    </RadioGroup>
  );
};

export default ColorPicker;
