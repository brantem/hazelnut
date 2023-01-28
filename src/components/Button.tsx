import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color?: string;
  variant?: 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const Button = ({ className, color = 'neutral', variant = 'solid', size = 'md', ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(
        `rounded-full focus:outline-none focus:ring-2 focus:ring-${color}-500 dark:focus:ring-${color}-700 disabled:opacity-70`,
        {
          [`bg-black text-white enabled:hover:bg-${color}-800`]: variant === 'solid',
          [`dark:text-white enabled:hover:bg-${color}-100 dark:enabled:hover:bg-${color}-800`]: variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-1.5': size === 'md',
          'px-4 py-3': size === 'lg',
        },
        className,
      )}
      {...props}
    />
  );
};

export default Button;
