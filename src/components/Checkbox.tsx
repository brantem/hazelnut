import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type CheckboxProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: React.ReactNode;
  color?: string;
};

const Checkbox = ({ label, name, color = 'neutral', ...props }: CheckboxProps) => {
  return (
    <div className="flex w-full items-center justify-between space-x-3">
      <label htmlFor={name} className={clsx('flex-1 truncate font-medium', props.disabled && 'text-neutral-500')}>
        {label}
      </label>

      <input
        {...props}
        type="checkbox"
        id={name}
        name={name}
        className={`h-5 w-5 rounded-full border-2 border-${color}-300 text-${color}-600 focus:ring-${color}-500 disabled:bg-neutral-400 dark:bg-transparent`}
        aria-checked={props.checked ? 'true' : 'false'}
      />
    </div>
  );
};

export default Checkbox;
