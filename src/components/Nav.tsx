import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import navigations from 'data/navigations';

type NavItemProps = {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
};

const NavItem = ({ icon, href, children }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href}>
      <a
        className={clsx([
          'flex-1 px-4 py-3 text-lg font-normal text-center flex items-center justify-center',
          isActive && 'bg-black text-white',
        ])}
      >
        {icon}
        <span className="ml-2">{children}</span>
      </a>
    </Link>
  );
};

const Nav = () => {
  return (
    <nav className="flex w-full border-t border-t-gray-200 divide-x divide-gray-200">
      {navigations.map((navigation, i) => (
        <NavItem key={i} icon={navigation.icon} href={navigation.href}>
          {navigation.text}
        </NavItem>
      ))}
    </nav>
  );
};

export default Nav;
