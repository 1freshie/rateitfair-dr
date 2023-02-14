/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

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
