import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import { formatDate } from '../../lib/date';
import { formatViewCount, getPageViews } from '../../lib/goatcounter';
import { Container } from '../Container';
import { Prose } from '../Prose';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface Props {
  children: React.ReactNode;
  meta: {
    title: string;
    description: string;
    date: string;
  };
  previousPathname?: string;
  className?: string;
}

export const NoteLayout = ({ children, meta, previousPathname, className }: Props) => {
  let router = useRouter();
  const [viewCount, setViewCount] = useState<number | null>(null);

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
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className={clsx("mx-auto max-w-3xl", className)}>
          {previousPathname && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:mb-0 lg:-mt-2 xl:-top-1.5 xl:left-0 xl:mt-0"
            >
              <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-primary" />
            </button>
          )}
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {meta.title}
              </h1>
              <div className="order-first flex items-center justify-between text-base text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <time dateTime={meta.date} className="ml-3">
                    {formatDate(meta.date)}
                  </time>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{formatViewCount(viewCount)}</span>
                </div>
              </div>
            </header>
            <Prose className="mt-8">{children}</Prose>
          </article>
        </div>
      </div>
    </Container>
  );
};
