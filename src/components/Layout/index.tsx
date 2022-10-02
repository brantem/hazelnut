import { useMemo } from 'react';
import { useRouter } from 'next/router';

import Nav from 'components/Nav';
import navigations from 'data/navigations';

const Layout = () => {
  const router = useRouter();
  const navigation = useMemo(() => {
    return navigations.find((navigation) => navigation.href === router.pathname)!;
  }, [router.pathname]);

  return (
    <>
      <header className="flex items-center py-4 px-3 text-2xl font-semibold">
        {navigation.icon} <h1 className="ml-3">{navigation.text}</h1>
      </header>
      <main className="flex-1"></main>
      <Nav />
    </>
  );
};

export default Layout;
