import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useMemo } from 'react';

import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CloseIcon } from './icons/CloseIcon';

// Get the environment variable to determine if Creating page should be hidden
// const hideCreatingPage = process.env.HIDE_PAGE_CREATING?.toUpperCase() === 'TRUE';

export const NavigationItems = [
  {
    name: 'Home',
    href: '/',
    type: 'internal',
    mainSite: true, // This item should always link to main site
  },
  {
    name: 'Notes',
    href: '/notes',
    type: 'internal',
  },
  {
    name: 'Creating',
    href: '/creating',
    type: 'internal',
  },
  {
    name: 'Uses',
    href: '/uses',
    type: 'internal',
  },
  // {
  //   name: 'Resume',
  //   href: 'https://cv.jarocki.me',
  //   type: 'external',
  // },
  {
    name: 'About',
    href: '/about',
    type: 'internal',
  },
  {
    name: 'Contact',
    href: '/contact',
    type: 'internal',
  },
  {
    name: 'AI',
    href: '/anish-ai',
    type: 'internal',
  },
  {
    name: 'Develop',
    href: '/develop',
    type: 'internal',
  }
] as const;

// Helper to determine if we're on the develop subdomain
export const useIsOnDevelopSubdomain = () => {
  const isDevelopSubdomain = 
    typeof window !== 'undefined' ? window.location.host.startsWith('develop.') : false;
  return isDevelopSubdomain;
};

// Helper to get the main domain from the current hostname
export const getMainDomain = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_URL || '';
  
  const hostname = window.location.host;
  if (hostname.startsWith('develop.')) {
    const mainDomain = hostname.split('.').slice(1).join('.');
    return `https://${mainDomain}`;
  }
  return '';
};

export const NavLink = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  // Check if this href is in the NEXT_PUBLIC_MAKE_PAGE_404 list
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const isDevelopSubdomain = useIsOnDevelopSubdomain();
  const mainDomain = getMainDomain();
  
  // For Home link on develop subdomain, link to main domain
  const finalHref = (href === '/' && isDevelopSubdomain && mainDomain) 
    ? mainDomain 
    : href;
  
  if (pagesToHide.includes(href)) {
    console.log(pagesToHide);
  } else {
    // If it's the home link on subdomain and we have a main domain, use <a> tag instead of Link
    if (href === '/' && isDevelopSubdomain && mainDomain) {
      return (
        <a href={mainDomain} className="transition hover:text-primary">
          {children}
        </a>
      );
    }
    
    return (
      <Link href={finalHref} className="transition hover:text-primary">
        {children}
      </Link>
    );
  }
};

const NavItem = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  // Check if this href is in the NEXT_PUBLIC_MAKE_PAGE_404 list
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  const isDevelopSubdomain = useIsOnDevelopSubdomain();
  const mainDomain = getMainDomain();
  
  // For Home link on develop subdomain, link to main domain
  const finalHref = (href === '/' && isDevelopSubdomain && mainDomain) 
    ? mainDomain 
    : href;
  
  if (pagesToHide.includes(href)) {
    console.log(pagesToHide);
  } else {
    return (
      <li>
        {href === '/' && isDevelopSubdomain && mainDomain ? (
          <a
            href={mainDomain}
            className={clsx(
              'relative block px-3 py-2 transition',
              isActive ? 'text-primary' : 'hover:text-primary',
            )}
          >
            {children}
          </a>
        ) : (
          <Link
            href={href}
            className={clsx(
              'relative block px-3 py-2 transition',
              isActive ? 'text-primary' : 'hover:text-primary',
            )}
          >
            {children}
          </Link>
        )}
      </li>
    );
  }
};

export const MobileNavItem = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  const isDevelopSubdomain = useIsOnDevelopSubdomain();
  const mainDomain = getMainDomain();
  
  // For Home link on develop subdomain, link to main domain
  const finalHref = (href === '/' && isDevelopSubdomain && mainDomain) 
    ? mainDomain 
    : href;
    
  if (href === '/' && isDevelopSubdomain && mainDomain) {
    return (
      <li>
        <Popover.Button as="button" onClick={() => window.location.href = mainDomain} className="block py-2">
          {children}
        </Popover.Button>
      </li>
    );
  }
  
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  );
};

export const DesktopNavigation = (
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) => {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        {NavigationItems.map((item) => {
          if (item.type === 'internal') {
            return (
              <NavItem key={item.href} href={item.href}>
                {item.name}
              </NavItem>
            );
          }

          return (
            <a
              key={item.href}
              className="transition hover:text-primary px-3 py-2"
              href={item.href}
              target="_blank"
            >
              {item.name}
            </a>
          );
        })}
      </ul>
    </nav>
  );
};

export const MobileNavigation = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
        Menu
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </Popover.Button>
              <h2 className="text-sm font-medium">Navigation</h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {NavigationItems.map((item) => (
                  <MobileNavItem key={item.href} href={item.href}>
                    {item.name}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};
