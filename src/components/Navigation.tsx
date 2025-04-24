import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CloseIcon } from './icons/CloseIcon';

// Get the environment variable to determine if Creating page should be hidden
// const hideCreatingPage = process.env.HIDE_PAGE_CREATING?.toUpperCase() === 'TRUE';

// Add this type definition above NavigationItems
type NavigationItem = {
  name: string;
  href: string;
  type: 'internal' | 'external';
  isSpecial?: boolean;
  color?: string; // <-- Add color property
};

export const NavigationItems: readonly NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    type: 'internal',
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
    name: 'Develop',
    href: '/develop',
    type: 'internal',
    isSpecial: true,
    color: 'red', // <-- Red for Develop
  },
  {
    name: 'Deliver',
    href: '/deliver',
    type: 'internal',
    isSpecial: true,
    color: 'blue', // <-- Blue for Deliver
  },
  {
    name: 'Discover',
    href: '/discover',
    type: 'internal',
    isSpecial: true,
    // You can set a color for Discover if needed
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
  }
] as const;

export const NavLink = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  // Check if this href is in the NEXT_PUBLIC_MAKE_PAGE_404 list
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  
  if (pagesToHide.includes(href)) {
    //console.log(pagesToHide);
  } else {
    return (
      <Link href={href} className="transition hover:text-primary">
        {children}
      </Link>
    );
  }

};

const NavItem = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  const isActive = useRouter().pathname === href;
  const navItem = NavigationItems.find(item => item.href === href);
  const isSpecial = navItem?.isSpecial;
  const color = navItem?.color;
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  
  if (pagesToHide.includes(href)) {
    // console.log(pagesToHide);
  } else {
    return (
      <li>
        <Link
          href={href}
          className={clsx(
            'relative block px-3 py-2 transition-all duration-300',
            isActive
              ? color === 'red'
                ? 'text-red-600'
                : color === 'blue'
                ? 'text-blue-600'
                : 'text-primary'
              : color === 'red'
              ? 'hover:text-red-600'
              : color === 'blue'
              ? 'hover:text-blue-600'
              : 'hover:text-primary',
            isSpecial && 'group',
            isSpecial && isActive && 'scale-105 font-semibold',
          )}
        >
          {children}
          {isSpecial && (
            <>
              {/* Subtle background effect */}
              <span
                className={clsx(
                  "absolute inset-0 -z-10 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  color === 'red'
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-primary/5'
                )}
              />
              {/* Animated underline */}
              <span
                className={clsx(
                  "absolute inset-x-1 -bottom-px h-px opacity-0 transition-all duration-300 group-hover:opacity-100",
                  color === 'red'
                    ? 'bg-gradient-to-r from-red-100/0 via-red-500/50 to-red-100/0'
                    : color === 'blue'
                    ? 'bg-gradient-to-r from-blue-100/0 via-blue-500/50 to-blue-100/0'
                    : 'bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0'
                )}
              />
              {/* Pulsing dot for active state */}
              {isActive && (
                <span
                  className={clsx(
                    "absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full animate-ping",
                    color === 'red'
                      ? 'bg-red-600'
                      : color === 'blue'
                      ? 'bg-blue-600'
                      : 'bg-primary'
                  )}
                />
              )}
              {/* Glowing border for active state */}
              {isActive && (
                <span
                  className={clsx(
                    "absolute inset-0 rounded-md ring-1 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 animate-pulse",
                    color === 'red'
                      ? 'ring-red-400/30'
                      : color === 'blue'
                      ? 'ring-blue-400/30'
                      : 'ring-primary/30'
                  )}
                />
              )}
            </>
          )}
        </Link>
      </li>
    );
  }
};

export const MobileNavItem = ({ href, children }: React.PropsWithChildren<{ href: string }>) => {
  const isActive = useRouter().pathname === href;
  const navItem = NavigationItems.find(item => item.href === href);
  const isSpecial = navItem?.isSpecial;
  const pagesToHide = process.env.NEXT_PUBLIC_MAKE_PAGE_404?.split(',') || [];
  if (pagesToHide.includes(href)) {

  } else {
    return (
      <li>
        <Popover.Button as={Link} href={href} className={clsx(
            'relative block px-3 py-2 transition-all duration-300',
            isActive ? 'text-primary' : 'hover:text-primary',
            isSpecial && 'group',
            isSpecial && isActive && 'scale-105 font-semibold',
          )}>
          {children}
        </Popover.Button>
      </li>
    );
  }
  
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