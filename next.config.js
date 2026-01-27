/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true, dirs: [] },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async redirects() {
    return [
      // aliasy z wyników Google
      { source: '/oferty', destination: '/oferta', permanent: true },
      { source: '/dom', destination: '/domy', permanent: true },
      { source: '/mieszkanie', destination: '/mieszkania', permanent: true },

      // sekcje z home jako aliasy
      { source: '/o-nas', destination: '/#o-nas', permanent: true }
    ];
  }
};

module.exports = nextConfig;
