import CircleStackIcon from 'components/icons/CircleStackIcon';
import DocumentCheckIcon from 'components/icons/DocumentCheckIcon';
import HomeIcon from 'components/icons/HomeIcon';

import { Navigation } from 'types/shared';

const navigations: Navigation[] = [
  {
    icon: <HomeIcon />,
    href: '/',
    text: 'Home',
  },
  {
    icon: <DocumentCheckIcon />,
    href: '/routines',
    text: 'Routines',
  },
  {
    icon: <CircleStackIcon />,
    href: '/stuff',
    text: 'Stuff',
  },
];

export default navigations;
