/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'emircan-kucukmotor-foodies.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
