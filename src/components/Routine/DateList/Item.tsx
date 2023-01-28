import clsx from 'clsx';

export type ItemProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children: React.ReactNode;
  label: React.ReactNode;
  isSelected?: boolean;
  onSelected: () => void;
};

const Item = ({ className, children, label, isSelected, onSelected, ...props }: ItemProps) => {
  return (
    <div
      {...props}
      className={clsx(
        'mb-3 flex flex-shrink-0 cursor-pointer flex-col items-center justify-center dark:text-white',
        className,
      )}
      onClick={onSelected}
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && onSelected()}
      aria-selected={isSelected ? 'true' : 'false'}
    >
      <span
        className={clsx(
          `flex h-10 w-10 items-center justify-center rounded-full`,
          !isSelected && 'bg-neutral-100 dark:bg-neutral-800',
          isSelected && 'border-black bg-black text-white dark:bg-white dark:text-black',
        )}
      >
        {children}
      </span>
      <span className="mt-1 text-sm">{label}</span>
    </div>
  );
};

export default Item;
