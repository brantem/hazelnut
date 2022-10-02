import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Navigation } from 'types/shared';

export type HeaderProps = {
  navigations: Navigation[];
  action?: {
    text: string;
    onClick: () => void;
  };
};

const Header = ({ navigations, action }: HeaderProps) => {
  const router = useRouter();
  const navigation = useMemo(() => {
    return navigations.find((navigation) => navigation.href === router.pathname)!;
  }, [navigations, router.pathname]);

  return (
    <header className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center text-2xl font-semibold">
        <div className="h-6 w-6">{navigation.icon}</div> <h1 className="ml-3">{navigation.text}</h1>
      </div>

      {action && (
        <button className="px-3 py-1.5 text-sm rounded-md hover:bg-neutral-100" onClick={action.onClick}>
          {action.text}
        </button>
      )}
    </header>
  );
};

export default Header;
