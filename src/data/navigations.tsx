import { DocumentCheckIcon, CircleStackIcon } from '@heroicons/react/24/outline';

import { Navigation } from 'types/shared';

const navigations: Navigation[] = [
  {
    icon: <DocumentCheckIcon className="h-6 w-6" />,
    href: '/',
    text: 'Routines',
  },
  {
    icon: <CircleStackIcon className="h-6 w-6" />,
    href: '/items',
    text: 'Items',
  },
];

export default navigations;
