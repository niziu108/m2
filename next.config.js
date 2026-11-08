/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true, dirs: [] },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  // Zdjęcia z /public: przeglądarka trzyma je 30 dni zamiast pytać o nie przy każdym wejściu
  async headers() {
    return [
      {
        source: '/:file((?!_next/).*\\.(?:webp|jpe?g|png|svg|ico))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
    ];
  },

  async redirects() {
    return [
      // aliasy z wyników Google
      { source: '/oferty', destination: '/nieruchomosci', permanent: true },
      { source: '/oferta', destination: '/nieruchomosci', permanent: true },
      { source: '/dom', destination: '/domy', permanent: true },
      { source: '/mieszkanie', destination: '/mieszkania', permanent: true },
      { source: '/dzialka', destination: '/dzialki', permanent: true },
      { source: '/dzialka-na-sprzedaz', destination: '/dzialki', permanent: true },

      // sekcje z home jako aliasy
      { source: '/o-nas', destination: '/#o-nas', permanent: true },
      { source: '/kontakt', destination: '/#kontakt', permanent: true }
    ];
  }
};

module.exports = nextConfig;
