import Button from 'components/Button';

type EmptySectionProps = {
  title: string;
  action: {
    children: React.ReactNode;
    onClick: () => void;
  };
};

const EmptySection = ({ title, action }: EmptySectionProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center dark:text-white" data-testid="empty-section">
      <p className="mb-3" data-testid="empty-section-title">
        {title}
      </p>

      <Button data-testid="empty-section-action" onClick={action.onClick} className="dark:bg-white dark:text-black">
        {action.children}
      </Button>
    </section>
  );
};

export default EmptySection;
