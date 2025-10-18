export const runtime = 'nodejs';
export const revalidate = 0;

import type { Metadata } from 'next';
import CategoryPage from '../(shop)/_components/CategoryPage';

export const metadata: Metadata = {
  title: 'Działki na sprzedaż | M2 Nieruchomości',
  description:
    'Działki na sprzedaż w Bełchatowie i okolicach. Sprawdź lokalizacje i ceny.',
  alternates: { canonical: '/dzialki' },
  openGraph: {
    title: 'Działki na sprzedaż | M2 Nieruchomości',
    description:
      'Aktualne działki na sprzedaż w Bełchatowie i okolicach.',
    url: '/dzialki',
    type: 'website',
  },
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Działki" category="DZIALKA" searchParams={searchParams} />
  );
}