import clsx from 'clsx';
import BaseMarkdown, { MarkdownToJSX } from 'markdown-to-jsx';

type MarkdownProps = {
  className?: string;
  options?: MarkdownToJSX.Options;
  children: string;
};

const Markdown = ({ className, options, ...props }: MarkdownProps) => {
  return (
    <BaseMarkdown
      options={{
        forceBlock: true,
        forceWrapper: true,
        ...options,
        overrides: {
          a: {
            props: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
          ...(options?.overrides || {}),
        },
      }}
      className={clsx('markdown', className)}
      {...props}
    />
  );
};

export default Markdown;
