import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: process.env.EXPORT_STATIC ? 'export' : 'standalone',
  trailingSlash: process.env.EXPORT_STATIC ? true : false,
  images: {
    unoptimized: process.env.EXPORT_STATIC ? true : false,
  },
  devIndicators: false,
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Aggressively exclude all test files and dependencies that cause issues
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx|mjs)$/,
      use: 'null-loader',
    });

    // Ignore problematic test directories and files
    config.resolve.alias = {
      ...config.resolve.alias,
      '**/test/**': false,
      '**/tests/**': false,
      '**/test.*': false,
      '**/spec.*': false,
      'tap': false,
      'tape': false,
      'fastbench': false,
      'desm': false,
      'why-is-node-running': false,
      'pino-elasticsearch': false,
    };

    // Add externals for problematic modules
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'tap': 'commonjs tap',
        'tape': 'commonjs tape',
        'fastbench': 'commonjs fastbench',
        'desm': 'commonjs desm',
        'why-is-node-running': 'commonjs why-is-node-running',
        'pino-elasticsearch': 'commonjs pino-elasticsearch',
      });
    }

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

export default bundleAnalyzer(nextConfig);
