/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    appDir: false,
    // fontLoaders: [
    //   {
    //     loader: '@next/font/google',
    //     options: {
    //       subsets: ['latin'],
    //     },
    //   }
    // ]
  },
};

module.exports = nextConfig;
