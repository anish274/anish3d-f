// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://54dd4a3d1895db33844a974b0cb7d0d7@o4509186037186560.ingest.us.sentry.io/4509186038497280",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
