/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 