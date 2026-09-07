export const runtime = 'nodejs';
export const revalidate = 0;

import type { Metadata } from 'next';
import CategoryPage from '../(shop)/_components/CategoryPage';

export const metadata: Metadata = {
  title: 'Oferty nieruchomości Bełchatów',
  description:
    'Wszystkie oferty biura M2 Nieruchomości: domy, mieszkania, działki i lokale na sprzedaż w Bełchatowie i okolicy do 40 km. Szukaj po lokalizacji, cenie i metrażu.',
  alternates: { canonical: '/nieruchomosci' },
  openGraph: {
    title: 'Oferty nieruchomości Bełchatów | M2 Nieruchomości',
    description:
      'Domy, mieszkania i działki na sprzedaż w Bełchatowie i okolicy. Wszystkie oferty M2 Nieruchomości w jednym miejscu.',
    url: '/nieruchomosci',
    type: 'website',
  },
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Nieruchomości" category={null} searchParams={searchParams} />
  );
}
