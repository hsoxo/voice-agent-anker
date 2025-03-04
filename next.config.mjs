/** @type {import('next').NextConfig} */
const nextConfig = {  
  async rewrites() {
    return [
      {
        source: "/voice-api/:path*", 
        destination: "http://44.213.201.101:7860/:path*",
      },
    ];
  },
};

export default nextConfig;
