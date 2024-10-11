/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['studentfiket.pockethost.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'studentfiket.pockethost.io',
        port: '',
        pathname: '/api/files/_pb_users_auth_/**',
      },
    ],
  }
};

export default nextConfig;
