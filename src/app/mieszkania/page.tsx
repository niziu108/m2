export const runtime = 'nodejs';
export const revalidate = 0;

import type { Metadata } from 'next';
import CategoryPage from '../(shop)/_components/CategoryPage';

export const metadata: Metadata = {
  title: 'Mieszkania na sprzedaż | M2 Nieruchomości',
  description:
    'Aktualne mieszkania na sprzedaż w Bełchatowie i okolicach. Zobacz zdjęcia, metraże i ceny.',
  alternates: { canonical: '/mieszkania' },
  openGraph: {
    title: 'Mieszkania na sprzedaż | M2 Nieruchomości',
    description:
      'Mieszkania w Bełchatowie i okolicach – bieżące oferty z cenami i zdjęciami.',
    url: '/mieszkania',
    type: 'website',
  },
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage
      title="Mieszkania"
      category="MIESZKANIE"
      searchParams={searchParams}
    />
  );
}