import '../../sentry.client.config'; // or just 'sentry.client.config' if in root
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import 'focus-visible';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Onest } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import React, { useEffect, useRef } from 'react';
import Head from 'next/head';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { GoatCounter } from '../components/GoatCounter';
import '../styles/index.css';
import '../styles/prism.css';

// Initialize Onest font
const onest = Onest({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-onest',
});

function usePrevious(value: string) {
  let ref = useRef<string>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function App({ Component, pageProps, router }: AppProps) {
  let previousPathname = usePrevious(router.pathname);
  
  // Handle asset prefixing for subdomain
  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined') {
      // Check if we're on develop subdomain
      if (window.location.hostname.startsWith('develop.')) {
        // Get main domain
        const mainDomain = window.location.hostname.split('.').slice(1).join('.');
        
        // Find all script and link tags with relative paths and update them
        document.querySelectorAll('script[src^="/"], link[href^="/"]').forEach(el => {
          if (el instanceof HTMLScriptElement && el.src.startsWith(window.location.origin)) {
            el.src = el.src.replace(window.location.origin, `https://${mainDomain}`);
          } else if (el instanceof HTMLLinkElement && el.href.startsWith(window.location.origin)) {
            el.href = el.href.replace(window.location.origin, `https://${mainDomain}`);
          }
        });
      }
    }
  }, []);

  return (
    <>
      <ThemeProvider attribute="class">
        <div className={`${onest.className}`}>
          <Head>
            <meta name="asset-domain" content={
              typeof window !== 'undefined' && window.location.hostname.startsWith('develop.') 
                ? `https://${window.location.hostname.split('.').slice(1).join('.')}` 
                : ''
            } />
          </Head>
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
            </div>
          </div>
          <div className="relative">
            <Header />
            <main>
              <Component previousPathname={previousPathname} {...pageProps} />
            </main>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
          <GoatCounter />
        </div>
      </ThemeProvider>
    </>
  );
}
