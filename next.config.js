const { NextFederationPlugin } = require('@module-federation/nextjs-mf');


module.exports = {
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
                name: "newcast-voice-agent",
                filename: "static/chunks/remoteEntry.js",
                exposes: {
                  "./ButtonApp": "./components/ButtonApp",
                },
              }),
        )
        return config
    },
};