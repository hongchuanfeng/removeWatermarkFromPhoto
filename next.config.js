/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['image-1308733829.cos.ap-shanghai.myqcloud.com'],
  },
}

module.exports = nextConfig
