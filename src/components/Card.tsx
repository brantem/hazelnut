import { HTMLAttributes } from 'react';

import Button from 'components/Button';

type CardProps = Omit<React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'title'> & {
  title: React.ReactNode;
  color: string;
  actions?: {
    children: React.ReactNode;
    onClick: () => void;
    testId?: string;
    skip?: boolean;
  }[];
  children: React.ReactNode;
};

const Card = ({ title, color, actions = [], children, ...props }: CardProps) => {
  return (
    <div className={`px-4 py-3 bg-${color}-50`} data-testid="card" {...props}>
      <div className="flex h-8 items-center justify-between space-x-3">
        <h3 className={`text-sm font-semibold uppercase text-${color}-600 truncate`}>{title}</h3>

        <div className="flex flex-shrink-0 items-center space-x-2">
          {actions.map((action, i) => {
            if (action.skip) return null;
            return (
              <Button
                key={i}
                className={typeof action.children === 'string' ? 'py-1' : '!p-1'}
                color={color}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                data-testid={action.testId}
              >
                {action.children}
              </Button>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
};

export default Card;
