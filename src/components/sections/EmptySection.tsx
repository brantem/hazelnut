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

      <button
        className="rounded-md bg-black py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 enabled:hover:bg-neutral-800 disabled:opacity-70"
        onClick={action.onClick}
        data-testid="empty-section-action"
      >
        {action.text}
      </button>
    </section>
  );
};

export default EmptySection;
