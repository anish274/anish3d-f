import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, useRef
import clsx from 'clsx';
import Link from 'next/link'; // Import Link

// Breadcrumb component import removed
import { Container } from '../Container';
import { Prose } from '../Prose';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { formatViewCount, getPageViews } from '../../lib/goatcounter';

// Define BreadcrumbItem type locally as it's not exported from Breadcrumb.tsx
type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent?: boolean;
};

interface Props {
  children: React.ReactNode;
  title: string;
  coverImage?: string | null;
  publishDate: string; // Added publishDate prop
  readingTime: number; // Added readingTime prop (in minutes)
  previousPathname?: string;
  className?: string;
}

export const DevelopLayout = ({ children, title, coverImage, publishDate, readingTime, previousPathname, className }: Props) => {
  let router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null); // Ref for the main header
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // Trigger sticky header when scrollY is greater than the main header's height
        const threshold = headerRef.current.offsetHeight;
        setIsSticky(window.scrollY > threshold);
      }
      // else {
      //   // Fallback removed or set to a default large value if needed
      //   // setIsSticky(window.scrollY > 400); // Example fallback
      // }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case the page loads scrolled down
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch view count when the component mounts or the route changes
  useEffect(() => {
    const fetchViewCount = async () => {
      if (router.asPath) {
        try {
          const count = await getPageViews(router.asPath);
          setViewCount(count);
        } catch (error) {
          console.error('Failed to fetch view count:', error);
          // Keep the current view count on error
        }
      }
    };

    fetchViewCount();
  }, [router.asPath]);

  return (
    <>
      {/* Sticky Header */}
      <div
        className={clsx(
          'mt-4 sticky top-0 z-40 w-full backdrop-blur transition-colors duration-500 lg:z-50 lg:border-b lg:border-zinc-900/10 dark:border-zinc-50/[0.1]',
          isSticky ? 'bg-white/90 supports-backdrop-blur:bg-white/60 dark:bg-zinc-900/75' : 'bg-transparent'
        )}
      >
        {/* Conditionally render Container content only when sticky */}
        {isSticky && (
          <Container className="py-3"> {/* Removed conditional opacity/pointer-events */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-zinc-800 dark:text-zinc-100 truncate pr-4">
                {title}
              </span>
              {/* Optional: Add back button or other elements here */}
            </div>
            
          </Container>
        )}
      </div>
    {/* Container now wraps Header, Breadcrumb, and Content */}
    <Container className="mt-8 lg:mt-8">
      {/* Custom Back Link - Styled as a badge */}
      <div className="mb-6 text-left"> {/* Increased bottom margin */}
         <Link href="/develop" className="inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors duration-150 ease-in-out group">
            <ArrowLeftIcon className="h-4 w-4 mr-2 stroke-zinc-500 dark:stroke-zinc-400 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200" />
            <span className="text-sm font-medium">Back to Development Notes List</span>
         </Link>
      </div>
      {/* Header Section - Moved inside Container, add ref */}
      <div ref={headerRef}
        className={`relative h-64 md:h-80 lg:h-96 bg-cover bg-center flex items-center justify-center text-center p-6 mb-8 rounded-lg overflow-hidden shadow-lg ${!coverImage ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        style={{
          backgroundImage: coverImage
            ? `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.85)), url(${coverImage})`
            : 'none',
        }}
      >
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${coverImage ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {title}
        </h1>
      </div>
      
      {/* Article metadata - Improved styling */}
      <div className="flex flex-wrap items-center justify-between mb-8 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg shadow-sm">
        <div className="flex items-center mb-2 md:mb-0">
          <svg className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time dateTime={publishDate} className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Published on: {new Date(publishDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
          </time>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center mb-2 md:mb-0">
            <svg className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{readingTime} min read</span>
          </div>
          
          <div className="flex items-center mb-2 md:mb-0">
            <svg className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{formatViewCount(viewCount)}</span>
          </div>
        </div>
      </div>
      
      <div className="xl:relative">
        <div className={clsx("mx-auto max-w-3xl", className)}>
          {/* {previousPathname && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:mb-0 lg:-mt-2 xl:-top-1.5 xl:left-0 xl:mt-0"
            >
              <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-primary" />
            </button>
          )} */}
          <article>
            {/* Breadcrumb removed from here */}
            <Prose className="">{children}</Prose>
          </article>
        </div>
      </div>
    </Container>
    </>
  );
};