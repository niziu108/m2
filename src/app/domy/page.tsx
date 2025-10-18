export const runtime = 'nodejs';
export const revalidate = 0;

import type { Metadata } from 'next';
import CategoryPage from '../(shop)/_components/CategoryPage';

export const metadata: Metadata = {
  title: 'Domy na sprzedaż | M2 Nieruchomości',
  description:
    'Aktualne domy na sprzedaż w Bełchatowie i okolicach. Sprawdź zdjęcia, metraże i ceny.',
  alternates: { canonical: '/domy' },
  openGraph: {
    title: 'Domy na sprzedaż | M2 Nieruchomości',
    description:
      'Domy w Bełchatowie i okolicach – bieżące oferty z cenami i zdjęciami.',
    url: '/domy',
    type: 'website',
  },
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Domy" category="DOM" searchParams={searchParams} />
  );
}