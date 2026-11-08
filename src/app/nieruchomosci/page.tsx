export const runtime = 'nodejs';
export const revalidate = 0;

import CategoryPage from '../(shop)/_components/CategoryPage';
import { categoryMetadata } from '@/lib/categoryMeta';

export function generateMetadata() {
  return categoryMetadata({
    category: null,
    path: '/nieruchomosci',
    title: 'Nieruchomości Bełchatów i okolice',
    lead: 'Domy, mieszkania, działki i lokale na sprzedaż w Bełchatowie i okolicy do 40 km. Szukaj po lokalizacji, cenie i metrażu.',
  });
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Nieruchomości" category={null} searchParams={searchParams} />
  );
}
