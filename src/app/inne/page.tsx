export const runtime = 'nodejs';
export const revalidate = 0;

import type { Metadata } from 'next';
import CategoryPage from '../(shop)/_components/CategoryPage';

export const metadata: Metadata = {
  title: 'Inne nieruchomości | M2 Nieruchomości',
  description:
    'Pozostałe oferty nieruchomości w Bełchatowie i okolicach.',
  alternates: { canonical: '/inne' },
  openGraph: {
    title: 'Inne nieruchomości | M2 Nieruchomości',
    description: 'Aktualne oferty w kategorii Inne.',
    url: '/inne',
    type: 'website',
  },
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Inne" category="INNE" searchParams={searchParams} />
  );
}
