import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Or your actual DSN string
  tracesSampleRate: 1.0,
  // Add other Sentry options here if needed
});