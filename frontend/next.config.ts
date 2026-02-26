/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**', // The '/**' means allow any image path from this domain
      },
      // You can add more objects here later if you use other sites!
    ],
  },
};

export default nextConfig;