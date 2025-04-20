import {withSentryConfig} from '@sentry/nextjs';
const config = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: ["geist"],
  assetPrefix: process.env.NODE_ENV === 'production' ? 
    process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined : 
    undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
    domains: ['anish3d.com', 'develop.anish3d.com'],
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/notes/:slug*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: '/develop',
        },
        {
          source: '/_next/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: 'https://anish3d.com/_next/:path*',
        },
        {
          source: '/assets/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: 'https://anish3d.com/assets/:path*',
        },
        {
          source: '/favicon/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: 'https://anish3d.com/favicon/:path*',
        },
      ],
    };
  },
};

export default withSentryConfig(config, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "anish3d",
project: "anish3d-f",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});