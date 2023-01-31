import { Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Button from 'components/Button';

import { Navigation } from 'types/shared';

type Action = { skip?: boolean } & (
  | { children: React.ReactNode; className?: string; onClick: () => void; testId?: string }
  | { render: () => React.ReactNode }
);

export type HeaderProps = {
  navigations: Navigation[];
  actions?: Action[];
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
        <div className="flex items-center text-xl font-semibold dark:text-white md:text-2xl">
          <h1>{navigation.text}</h1>
        </div>

        {actions?.length ? (
          <div className="flex items-center space-x-2" data-testid="header-actions">
            {actions.map((action, i) => {
              if (action.skip) return null;
              return 'render' in action ? (
                <Fragment key={i}>{action.render()}</Fragment>
              ) : (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className={action.className}
                  onClick={action.onClick}
                  data-testid={action.testId}
                >
                  {action.children}
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
