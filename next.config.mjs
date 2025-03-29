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

export default config;
