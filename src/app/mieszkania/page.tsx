export const runtime = 'nodejs';
export const revalidate = 0;

import CategoryPage from '../(shop)/_components/CategoryPage';
import { categoryMetadata } from '@/lib/categoryMeta';

export function generateMetadata() {
  return categoryMetadata({
    category: 'MIESZKANIE',
    path: '/mieszkania',
    title: 'Mieszkania na sprzedaż Bełchatów',
    lead: 'Aktualne mieszkania na sprzedaż w Bełchatowie i okolicy, ze zdjęciami, metrażem i ceną.',
  });
}

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
