import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import AvatarImage from '../../public/assets/blog/authors/anish_profile.png';
import { getMainDomain, useIsOnDevelopSubdomain } from './Navigation';

type Props = {
  large?: boolean;
} & React.HTMLAttributes<HTMLAnchorElement>;

export const Avatar = ({ large = false, className, ...props }: Props) => {
  const isDevelopSubdomain = useIsOnDevelopSubdomain();
  const mainDomain = getMainDomain();
  
  // For the Link component, we need to adapt how we handle the href
  // If on develop subdomain, we need to use an <a> tag instead
  if (isDevelopSubdomain && mainDomain) {
    return (
      <a href={mainDomain} aria-label="Home" className={clsx(className, 'pointer-events-auto')} {...props}>
        <Image
          src={AvatarImage}
          alt=""
          sizes={large ? '4rem' : '2.25rem'}
          className={clsx(
            'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
            large ? 'h-16 w-16' : 'h-9 w-9',
          )}
          priority
        />
      </a>
    );
  }

  return (
    <Link href="/" aria-label="Home" className={clsx(className, 'pointer-events-auto')} {...props}>
      <Image
        src={AvatarImage}
        alt=""
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  );
};
