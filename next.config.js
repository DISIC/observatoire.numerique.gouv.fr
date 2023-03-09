const withTM = require('next-transpile-modules')(['@codegouvfr/react-dsfr']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['fr'],
    defaultLocale: 'fr'
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource'
    });

    return config;
  }
});

module.exports = nextConfig;
