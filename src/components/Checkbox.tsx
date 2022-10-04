import { InputHTMLAttributes } from 'react';

type CheckboxProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
};

const Checkbox = ({ label, name, ...props }: CheckboxProps) => {
  return (
    <div className="w-full flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-gray-300 text-neutral-600 focus:ring-neutral-500"
      />
      <label htmlFor={name} className="font-medium text-gray-700 ml-3 flex-1 truncate">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
