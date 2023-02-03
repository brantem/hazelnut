import { InputHTMLAttributes } from 'react';

import { cn } from 'lib/helpers';

export type InputProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label?: string;
};

const Input = ({ label, name, className, ...props }: InputProps) => {
  return (
    <div className="w-full flex-1">
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm text-neutral-700 dark:text-white">
          {label}
        </label>
      )}

      <input
        type="text"
        {...props}
        name={name}
        id={name}
        className={cn(
          'block w-full rounded-md border-neutral-300 bg-white focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500',
          'dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
          className,
        )}
      />
    </div>
  );
};

export default Input;
