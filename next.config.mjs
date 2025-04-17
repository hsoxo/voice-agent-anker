/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/voice-api/:path*",
        destination: "http://newcast-dev-1.hhe.by/:path*",
      },
    ];
  },
};

export default nextConfig;
