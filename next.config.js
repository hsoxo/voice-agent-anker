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
              name: "newcastVoiceAgent",
              filename: "static/chunks/remoteEntry.js",
              exposes: {
                "./ButtonApp": "./components/ButtonApp",
              },  
              shared: {
                react: { singleton: true, requiredVersion: '18.2.0' },
                'react-dom': { singleton: true, requiredVersion: '18.2.0' },
              },
              extraOptions: {
                automaticAsyncBoundary: true,
              },
            
            }),
        )
        return config
    },
    exportPathMap: async function () {
      return {
        '/': { page: '/' },
        '/call-settings': { page: '/call-settings' },
        // ...
      }
    }
};