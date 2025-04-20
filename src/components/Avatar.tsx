import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import AvatarImage from '../../public/assets/blog/authors/anish_profile.png';
import { getMainDomain, useIsOnDevelopSubdomain } from './Navigation';

type Props = {
  large?: boolean;
} & React.HTMLAttributes<HTMLAnchorElement>;

export const Avatar = ({ large = false, className, ...props }: Props) => {
  const isDevelopSubdomain = useIsOnDevelopSubdomain();
  const mainDomain = getMainDomain();
  
  // State to hold the image src with proper domain prefix
  const [imageSrc, setImageSrc] = useState(AvatarImage);
  
  // Effect to handle image loading from main domain
  useEffect(() => {
    // If we're on a production build and on the develop subdomain
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.hostname.startsWith('develop.')) {
      // We need to manually set the correct image src for static imports
      // This is a workaround since Next.js static imports can't be dynamically prefixed
      const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || `https://${window.location.hostname.split('.').slice(1).join('.')}`;
      // For images loaded via static imports, we can't directly modify the URL
      // We'll rely on the assetPrefix config in next.config.js
    }
  }, []);

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
          unoptimized={isDevelopSubdomain} // Skip Next.js image optimization on subdomain
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
