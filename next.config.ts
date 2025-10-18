// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
