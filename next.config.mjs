/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Демоверсия AI-экосистемы — статичная страница в public/ecosystem
  async rewrites() {
    return [{ source: '/ecosystem', destination: '/ecosystem/index.html' }]
  },
}

export default nextConfig
