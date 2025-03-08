module.exports = {
  siteUrl: process.env.SITE_URL || 'https://anish3d.com',
  generateRobotsTxt: true,
  autoLastmod: false,
  generateIndexSitemap: false,
  changefreq: null,
  priority: null,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
