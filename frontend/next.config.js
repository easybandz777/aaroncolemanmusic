/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization configuration
  images: {
    domains: ['localhost', '127.0.0.1'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_MEDIA_URL: process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000/media/',
  },
  
  // API rewrites for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000/media/'}:path*`,
      },
    ];
  },
  
  // TypeScript configuration
  typescript: {
    // Type checking is handled by a separate process in CI
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // ESLint is handled by a separate process in CI
    ignoreDuringBuilds: false,
  },
  
  // Experimental features
  experimental: {
    // Enable app directory (Next.js 13+)
    appDir: true,
  },
};

module.exports = nextConfig; 