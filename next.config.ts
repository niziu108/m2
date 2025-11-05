// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // kanonicznie BEZ końcowego slasha
  trailingSlash: false,

  eslint: { ignoreDuringBuilds: true, dirs: [] },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async redirects() {
    return [
      // aliasy z wyników Google
      { source: '/oferty',     destination: '/oferta',      permanent: true },
      { source: '/dom',        destination: '/domy',        permanent: true },
      { source: '/mieszkanie', destination: '/mieszkania',  permanent: true },

      // sekcje z home jako aliasy
      { source: '/o-nas',      destination: '/#o-nas',      permanent: true },
      { source: '/onas',       destination: '/#o-nas',      permanent: true },
      { source: '/kontakt',    destination: '/#kontakt',    permanent: true },

      // ⬇️ usuwanie końcowego slasha TYLKO gdy jest co najmniej jeden segment ścieżki
      // /coś/  ->  /coś   (NIE tyka "/")
      { source: '/:path+/', destination: '/:path+', permanent: true },
    ];
  },
};

export default nextConfig;
