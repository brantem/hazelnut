import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type RadioProps = Omit<React.DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'value'> & {
  label: React.ReactNode;
  value: string;
  color?: string;
};

const Radio = ({ label, name, color = 'neutral', ...props }: RadioProps) => {
  const id = name ? name + '-' + props.value : 'radio-' + props.value;

  return (
    <div className="flex w-full items-center justify-between space-x-3">
      <label htmlFor={id} className={clsx('flex-1 truncate font-medium', props.disabled && 'text-neutral-500')}>
        {label}
      </label>

      <input
        {...props}
        type="radio"
        id={id}
        name={name}
        className={`h-5 w-5 rounded-full border-${color}-300 text-${color}-600 focus:ring-${color}-500 disabled:bg-neutral-400 disabled:hover:bg-neutral-400`}
        aria-checked={props.checked ? 'true' : 'false'}
      />
    </div>
  );
};

export default Radio;
