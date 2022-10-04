import { InputHTMLAttributes } from 'react';

type InputProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
};

const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-neutral-700">
        {label}
      </label>
      <input
        name={name}
        id={name}
        type="text"
        {...props}
        className="mt-1 block w-full rounded-md border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm disabled:bg-neutral-100 disabled:text-neutral-500 disabled:border-neutral-200"
      />
    </div>
  );
};

export default Input;
