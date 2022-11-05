import Button from 'components/Button';

type EmptySectionProps = {
  title: string;
  action: { text: string; onClick: () => void };
};

const EmptySection = ({ title, action }: EmptySectionProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center" data-testid="empty-section">
      <p className="mb-3" data-testid="empty-section-title">
        {title}
      </p>

      <Button data-testid="empty-section-action" onClick={action.onClick}>
        {action.text}
      </Button>
    </section>
  );
};

export default EmptySection;
