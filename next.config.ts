import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.EXPORT_STATIC ? 'export' : 'standalone',
  trailingSlash: process.env.EXPORT_STATIC ? true : false,
  images: {
    unoptimized: process.env.EXPORT_STATIC ? true : false,
  },
  devIndicators: false,
  webpack: (config, { isServer }) => {
    // Exclude test files from webpack processing
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });

    // Ignore test directories
    config.resolve.alias = {
      ...config.resolve.alias,
      '**/test': false,
      '**/tests': false,
    };

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
