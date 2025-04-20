// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://54dd4a3d1895db33844a974b0cb7d0d7@o4509186037186560.ingest.us.sentry.io/4509186038497280",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
