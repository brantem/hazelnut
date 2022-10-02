import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { Navigation } from 'types/shared';

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
          'flex-1 px-4 py-3 font-medium text-center flex items-center justify-center',
          isActive && 'bg-black text-white',
        ])}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className="h-6 w-6">{icon}</div>
        <span className="ml-2">{children}</span>
      </a>
    </Link>
  );
};

const Nav = ({ navigations }: { navigations: Navigation[] }) => {
  return (
    <nav className="flex w-full border-t border-t-neutral-200 divide-x divide-neutral-200">
      {navigations.map((navigation, i) => (
        <NavItem key={i} icon={navigation.icon} href={navigation.href}>
          {navigation.text}
        </NavItem>
      ))}
    </nav>
  );
};

export default Nav;
