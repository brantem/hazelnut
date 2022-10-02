import { InputHTMLAttributes } from 'react';

type InputProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
};

const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <div className="px-4 py-3">
      <label htmlFor={name} className="block text-sm text-neutral-700">
        {label}
      </label>
      <input
        {...props}
        type="text"
        name={name}
        id={name}
        className="mt-1 block w-full rounded-md border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200"
      />
    </div>
  );
};

export default Input;
