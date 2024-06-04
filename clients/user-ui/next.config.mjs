/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["dummyimage.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
