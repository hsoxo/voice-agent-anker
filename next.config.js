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
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: "newcastVoiceAgent",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./ButtonApp": "./components/ButtonApp",
          "./VideoAgent": "./components/VideoAgent/VideoAgent",
          "./VideoAgentRoom": "./components/VideoAgent/RoomWrapper",
          "./VideoAgentButton": "./components/VideoAgent/StartButton",
        },
        shared: {
          react: { singleton: true, requiredVersion: "18.2.0" },
          "react-dom": { singleton: true, requiredVersion: "18.2.0" },
        },
        extraOptions: {
          automaticAsyncBoundary: true,
        },
        library: { type: "module" },
      })
    );
    // if (!isServer) {
    //   config.externals = {
    //     ...config.externals,
    //     react: "React",
    //     "react-dom": "ReactDOM",
    //   };
    // }
    return config;
  },
};
