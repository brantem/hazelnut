import { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

type TextareaProps = React.DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
  label?: string;
};

const Textarea = ({ label, name, className, ...props }: TextareaProps) => {
  return (
    <div className="w-full flex-1">
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm text-neutral-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        name={name}
        id={name}
        className={clsx(
          'block w-full rounded-md border-neutral-300 bg-white focus:border-neutral-500 focus:ring-neutral-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500',
          className,
        )}
      />
    </div>
  );
};

export default Textarea;
