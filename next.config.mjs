const config = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: ["geist"],
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
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: '/develop/:path*',
        },
        {
          source: '/assets/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: '/assets/:path*',
        },
        {
          source: '/favicon/:path*',
          has: [
            {
              type: 'host',
              value: 'develop.anish3d.com',
            },
          ],
          destination: '/favicon/:path*',
        },
      ],
    };
  },
};

export default config;
