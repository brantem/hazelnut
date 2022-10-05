import { InputHTMLAttributes } from 'react';

type CheckboxProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  color?: string;
};

const Checkbox = ({ label, name, color = 'neutral', ...props }: CheckboxProps) => {
  return (
    <div className="flex w-full items-center justify-between space-x-3">
      <label htmlFor={name} className="flex-1 truncate font-medium text-neutral-700">
        {label}
      </label>

      <input
        {...props}
        type="checkbox"
        id={name}
        name={name}
        className={`h-5 w-5 rounded-full border-${color}-300 text-${color}-600 focus:ring-${color}-500`}
        aria-checked={props.checked ? 'true' : 'false'}
      />
    </div>
  );
};

export default Checkbox;
