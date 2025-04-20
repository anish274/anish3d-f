import { Head, Html, Main, NextScript } from 'next/document';

// This function helps determine if we're running on a subdomain
function getDomainPrefix() {
  const isServer = typeof window === 'undefined';
  // On the server, we can't detect the hostname, so we use the env variable
  if (isServer) {
    return '';
  }
  
  // On the client, check if we're on develop subdomain
  const hostname = window.location.hostname;
  if (hostname.startsWith('develop.')) {
    // Get the main domain
    const mainDomain = hostname.split('.').slice(1).join('.');
    return `https://${mainDomain}`;
  }
  
  return '';
}

export default function Document() {
  // Prefix for assets when on subdomain
  const assetPrefix = getDomainPrefix();
  
  return (
    <Html className="h-full antialiased" lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href={`${assetPrefix}/favicon/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${assetPrefix}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${assetPrefix}/favicon/favicon-16x16.png`} />
        <link rel="manifest" href={`${assetPrefix}/favicon/site.webmanifest`} />
        <link rel="shortcut icon" href={`${assetPrefix}/favicon/favicon.ico`} />
        <meta name="theme-color" content="#18181b" />
        
        {/* Add script to ensure static assets from main domain */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Check if we're on develop subdomain
              if (window.location.hostname.startsWith('develop.')) {
                // Get the main domain
                const mainDomain = window.location.hostname.split('.').slice(1).join('.');
                
                // Set assetPrefix for Next.js
                window.__NEXT_DATA__.assetPrefix = 'https://' + mainDomain;
              }
            })();
          `
        }} />
      </Head>
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-300">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
