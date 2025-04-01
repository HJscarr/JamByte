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
        canvas: false,
        encoding: false,
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
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
