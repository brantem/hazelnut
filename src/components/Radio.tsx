import { InputHTMLAttributes } from 'react';

type RadioProps = Omit<
  React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'name' | 'value'
> & {
  label: React.ReactNode;
  name: string;
  value: string;
  color?: string;
};

const Radio = ({ label, name, color = 'neutral', ...props }: RadioProps) => {
  const id = name + '-' + props.value;

  return (
    <div className="flex w-full items-center justify-between space-x-3">
      <label htmlFor={id} className="flex-1 truncate font-medium">
        {label}
      </label>

      <input
        {...props}
        type="radio"
        id={id}
        name={name}
        className={`h-5 w-5 rounded-full border-${color}-300 text-${color}-600 focus:ring-${color}-500 disabled:bg-neutral-400 dark:bg-transparent`}
        aria-checked={props.checked ? 'true' : 'false'}
      />
    </div>
  );
};

export default Radio;
