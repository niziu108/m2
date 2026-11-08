export const runtime = 'nodejs';
export const revalidate = 0;

import CategoryPage from '../(shop)/_components/CategoryPage';
import { categoryMetadata } from '@/lib/categoryMeta';

export function generateMetadata() {
  return categoryMetadata({
    category: 'DZIALKA',
    path: '/dzialki',
    title: 'Działki na sprzedaż Bełchatów i okolice',
    lead: 'Działki budowlane i rolne na sprzedaż w Bełchatowie i okolicy do 40 km, z lokalizacją, metrażem i ceną za m².',
  });
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <CategoryPage title="Działki" category="DZIALKA" searchParams={searchParams} />
  );
}
