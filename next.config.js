/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  headers: () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Content-Security-Policy', value: "default-src 'self'" }
      ],
    },
  ],
}

module.exports = nextConfig
