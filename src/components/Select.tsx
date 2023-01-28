import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

type SelectProps = React.DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
  label?: string;
};

const Select = ({ label, name, className, ...props }: SelectProps) => {
  return (
    <div className="w-full flex-1">
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm text-neutral-700 dark:text-white">
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        className={clsx(
          'block w-full rounded-md border-neutral-300 bg-white opacity-100 focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500',
          'dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default Select;
