import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label?: string;
};

const Input = ({ label, name, className, ...props }: InputProps) => {
  return (
    <div className="w-full flex-1">
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm text-neutral-700">
          {label}
        </label>
      )}
      <input
        type="text"
        {...props}
        name={name}
        id={name}
        className={clsx(
          'block h-10 w-full rounded-md border-neutral-300 bg-white focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500',
          className,
        )}
      />
    </div>
  );
};

export default Input;
