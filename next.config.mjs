import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.mux.com'],
    unoptimized: true, // Required for Cloudflare Pages
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'jambyte.io'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
        net: false,
        tls: false,
        fs: false,
        dns: false,
      };
    }

    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
    ];

    // Add support for .lottie files
    config.module.rules.push({
      test: /\.lottie$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[hash][ext]',
      },
    });

    return config;
  },
  swcMinify: true,
  poweredByHeader: false,
  // PostHog proxy rewrites
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
