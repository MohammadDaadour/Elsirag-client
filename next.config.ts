// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Pages that existed while the site was a shop. Anyone arriving from an old
// link, a bookmark or a search result is sent to the catalogue instead of a 404.
const retiredShopPaths = [
  'cart',
  'checkout',
  'orders',
  'order-confirmation',
  'wishlist',
  'register',
  'verify',
  'forgot-password',
  'reset-password',
];

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async redirects() {
    return [
      // Locale-prefixed first: these are the URLs the site actually produced.
      ...retiredShopPaths.map(path => ({
        source: `/:locale(en|ar)/${path}`,
        destination: '/:locale/catalogue',
        permanent: true,
      })),
      ...retiredShopPaths.map(path => ({
        source: `/${path}`,
        destination: '/catalogue',
        permanent: true,
      })),
      // About is written but still has gaps, so it is unlinked and unreachable
      // for now. Delete these two entries to bring it back.
      {
        source: '/:locale(en|ar)/about',
        destination: '/:locale',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/',
        permanent: false,
      },
      // Category pages moved under the catalogue and keep their id.
      {
        source: '/:locale(en|ar)/category/:id',
        destination: '/:locale/catalogue/:id',
        permanent: true,
      },
      {
        source: '/category/:id',
        destination: '/catalogue/:id',
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
