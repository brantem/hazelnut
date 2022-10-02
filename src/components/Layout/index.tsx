import Header, { HeaderProps } from 'components/Header';
import Nav from 'components/Nav';

type LayoutProps = {
  header?: HeaderProps;
  children?: React.ReactNode;
};

const Layout = ({ header, children }: LayoutProps) => {
  return (
    <>
      <Header {...header} />
      <main className="flex-1">{children}</main>
      <Nav />
    </>
  );
};

export default Layout;
