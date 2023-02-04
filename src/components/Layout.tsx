import Header, { HeaderProps } from 'components/Header';
import Nav from 'components/Nav';

import navigations from 'data/navigations';

type LayoutProps = {
  header?: Omit<HeaderProps, 'navigations'>;
  children?: React.ReactNode;
};

const Layout = ({ header, children }: LayoutProps) => {
  return (
    <>
      <Header {...header} navigations={navigations} />
      <main className="flex flex-1 flex-col overflow-y-hidden">{children}</main>
      <Nav navigations={navigations} />
    </>
  );
};

export default Layout;
