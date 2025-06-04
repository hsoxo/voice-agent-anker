/** @type {import('next').NextConfig} */

import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/voice-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },

  webpack(config, { isServer }) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'newcast-voice-agent',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './ButtonApp': './components/ButtonApp.tsx',
        },
      })
    );

    return config;
  },
};

export default nextConfig;
