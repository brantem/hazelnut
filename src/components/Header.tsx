import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Button from 'components/Button';

import { Navigation } from 'types/shared';

export type HeaderProps = {
  navigations: Navigation[];
  actions?: {
    text: React.ReactNode;
    className?: string;
    onClick: () => void;
    testId?: string;
    skip?: boolean;
  }[];
};

const Header = ({ navigations, actions }: HeaderProps) => {
  const router = useRouter();
  const navigation = useMemo(() => {
    return navigations.find((navigation) => navigation.href === router.pathname)!;
  }, [navigations, router.pathname]);
  const title = `${navigation.text} - hazelnut`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center text-2xl font-semibold">
          <div className="h-6 w-6">{navigation.icon}</div> <h1 className="ml-3">{navigation.text}</h1>
        </div>

        {actions?.length ? (
          <div className="flex items-center space-x-2">
            {actions.map((action, i) => {
              if (action.skip) return null;
              return (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className={action.className}
                  onClick={action.onClick}
                  data-testid={action.testId}
                >
                  {action.text}
                </Button>
              );
            })}
          </div>
        ) : null}
      </header>
    </>
  );
};

export default Header;
