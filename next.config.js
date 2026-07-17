/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR (Server-Side Rendering) - Next.js 14 ile otomatik aktif
  reactStrictMode: true,
  
  // Production optimizasyonları
  swcMinify: true,
  
  // SSL ve Güvenlik Başlıkları
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ]
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // Görüntülenen boyutlara yakın genişlikler (PageSpeed — gereksiz 750/1920 indirmeyi önler)
    deviceSizes: [350, 384, 560, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 224, 256, 350, 384, 560],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performans optimizasyonları
  compress: true,
  
  // Power by başlığını kaldır
  poweredByHeader: false,
  
  // Experimental optimizations
  // Static sayfa üretimi (build) için üst süre — DB sayfaları force-dynamic ile atlanır
  staticPageGenerationTimeout: 120,

  experimental: {
    // optimizeCss (critters) dev'de layout.css 404 / stilless sayfa üretebiliyor;
    // yalnızca production build'de aç.
    optimizeCss: process.env.NODE_ENV === 'production',
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // Ensure heavy server-only packages (MSSQL/Tedious) stay external in RSC bundler
    serverComponentsExternalPackages: ['mssql', 'tedious'],
  },
  
  // Route prefetching optimizations
  onDemandEntries: {
    // Keep pages in memory for 60 seconds
    maxInactiveAge: 60 * 1000,
    // Keep pages in memory for up to 5 pages
    pagesBufferLength: 5,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
            },
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
  
  // SEO için Türkçe URL rewrites
  async rewrites() {
    return [
      {
        source: '/hakkimizda',
        destination: '/about',
      },
      {
        source: '/iletisim',
        destination: '/contact',
      },
    ];
  },

  // Trailing slash yönetimi - tüm URL'ler trailing slash olmadan
  trailingSlash: false,

  // Redirects - trailing slash ve eski URL'ler için
  async redirects() {
    return [
      // www olmayan adresi www'ye yönlendir (JWT, cookie, manifest uyumu)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'yonelotoyedekparca.com' }],
        destination: 'https://www.yonelotoyedekparca.com/:path*',
        permanent: true,
      },
      // Trailing slash redirects - /urunler/ -> /urunler
      {
        source: '/urunler/',
        destination: '/urunler',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
      // Eski /products URL'leri (sayfa bileşenleri kaldırıldı; yönlendirme burada)
      {
        source: '/products',
        destination: '/urunler',
        permanent: true,
      },
      {
        source: '/products/:path*',
        destination: '/urunler/urun/:path*',
        permanent: true,
      },
      // Query parametreli blog kategori sayfalarını noindex için redirect et
      {
        source: '/blog',
        has: [
          {
            type: 'query',
            key: 'category',
          },
        ],
        destination: '/blog',
        permanent: false, // Temporary redirect to prevent indexing
      },
    ];
  },
};

module.exports = nextConfig;

