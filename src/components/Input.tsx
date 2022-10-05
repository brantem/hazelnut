import { InputHTMLAttributes } from 'react';

type InputProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label?: string;
};

const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <div>
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
        className="block w-full rounded-md border-neutral-300 bg-white focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 sm:text-sm"
      />
    </div>
  );
};

export default Input;
