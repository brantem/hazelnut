import { InputHTMLAttributes } from 'react';

type CheckboxProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  color?: string;
};

const Checkbox = ({ label, name, color = 'neutral', ...props }: CheckboxProps) => {
  return (
    <div className="w-full flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        {...props}
        className={`h-4 w-4 rounded border-${color}-300 text-${color}-600 focus:ring-${color}-500`}
      />
      <label htmlFor={name} className="font-medium text-neutral-700 ml-3 flex-1 truncate">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
