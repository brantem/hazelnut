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

      <div className="flex justify-between space-x-2 mt-2 w-full">
        {colors.map((color) => {
          const isActive = color === value;
          return (
            <RadioGroup.Option
              value={color}
              key={color}
              className={clsx(
                `h-8 md:h-10 w-full rounded-full focus:outline-none ring-offset-2`,
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
