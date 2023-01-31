import { PencilSquareIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';

import Button from 'components/Button';

import { History } from 'types/history';

const Markdown = dynamic(() => import('components/Markdown'));

type NoteProps = {
  history: History;
  onActionClick: () => void;
};

const Note = ({ history, onActionClick }: NoteProps) => {
  if (!history.note) return null;
  return (
    <div className="pt-3" data-testid="history-card-note">
      <div className="mb-1 flex items-center justify-between space-x-3">
        <h4 className={`text-${history.color}-500`}>Note</h4>
        <Button
          color={history.color}
          variant="ghost"
          className="rounded-full !p-1"
          onClick={onActionClick}
          data-testid="history-card-note-action"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </div>
      <Markdown
        className="text-sm text-neutral-500 dark:text-neutral-400"
        options={{
          overrides: {
            hr: {
              props: {
                className: 'border-neutral-300',
              },
            },
          },
        }}
      >
        {history.note}
      </Markdown>
    </div>
  );
};

export default Note;
