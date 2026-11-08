export const runtime = 'nodejs';
export const revalidate = 0;

import CategoryPage from '../(shop)/_components/CategoryPage';
import { categoryMetadata } from '@/lib/categoryMeta';

export function generateMetadata() {
  return categoryMetadata({
    category: 'DOM',
    path: '/domy',
    title: 'Domy na sprzedaż Bełchatów i okolice',
    lead: 'Aktualne domy na sprzedaż w Bełchatowie i okolicy do 40 km, ze zdjęciami, metrażem i ceną.',
  });
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Domy" category="DOM" searchParams={searchParams} />
  );
}
