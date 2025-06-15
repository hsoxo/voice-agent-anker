const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  async headers() {
    return [
      {
        source: "/static/chunks/remoteEntry.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/voice-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },

  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "newcastVoiceAgent",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./ButtonApp": "./components/ButtonApp",
        },
        shared: {
          react: { singleton: true, requiredVersion: "18.2.0", eager: true },
          "react-dom": {
            singleton: true,
            requiredVersion: "18.2.0",
            eager: true,
          },
        },
        extraOptions: {
          automaticAsyncBoundary: true,
        },
        library: { type: "module" },
      })
    );
    return config;
  },
};
