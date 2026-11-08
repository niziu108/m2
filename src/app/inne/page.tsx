export const runtime = 'nodejs';
export const revalidate = 0;

import CategoryPage from '../(shop)/_components/CategoryPage';
import { categoryMetadata } from '@/lib/categoryMeta';

export function generateMetadata() {
  return categoryMetadata({
    category: 'INNE',
    path: '/inne',
    title: 'Lokale i inne nieruchomości Bełchatów',
    lead: 'Lokale i pozostałe nieruchomości na sprzedaż w Bełchatowie i okolicy.',
  });
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Inne" category="INNE" searchParams={searchParams} />
  );
}
