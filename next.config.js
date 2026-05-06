/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses
  compress: true,

  // Strict mode for better React performance
  reactStrictMode: true,

  // Experimental optimizations
  experimental: {
    // Optimize package imports — tree-shake large icon/component libraries
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js', '@supabase/ssr'],
  },

  images: {
    // Use modern formats for better compression
    formats: ['image/avif', 'image/webp'],

    // Aggressive caching — images don't change often
    minimumCacheTTL: 86400, // 24 hours

    // Reasonable device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    remotePatterns: [
      { protocol: 'https', hostname: 'zfievjxkmubnokerecys.supabase.co' },
      { protocol: 'https', hostname: 'media.licdn.com' },
      { protocol: 'https', hostname: 'logodix.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'jigarsable.vercel.app' },
      { protocol: 'https', hostname: 'pluspng.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'media.geeksforgeeks.org' },
    ],
  },

  // Security + performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache static assets aggressively
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache Next.js static chunks for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public assets for 1 day
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
