import { InputHTMLAttributes } from 'react';

type CheckboxProps = React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  color?: string;
};

const Checkbox = ({ label, name, color = 'neutral', ...props }: CheckboxProps) => {
  return (
    <div className="flex w-full items-center">
      <input
        {...props}
        type="checkbox"
        id={name}
        name={name}
        className={`h-4 w-4 rounded border-${color}-300 text-${color}-600 focus:ring-${color}-500`}
        aria-checked={props.checked ? 'true' : 'false'}
      />
      <label htmlFor={name} className="ml-3 flex-1 truncate font-medium text-neutral-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
