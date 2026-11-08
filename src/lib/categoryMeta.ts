// src/lib/categoryMeta.ts
// Tytuły stron kategorii z liczbą ofert i ceną: „Działki na sprzedaż Bełchatów i okolice: 28 ofert
// od 55 000 zł”. Konkret w wynikach Google zachęca do kliknięcia i aktualizuje się sam.
import 'server-only';

import type { Metadata } from 'next';
import { offersSummary } from '@/lib/listings';
import { ofertyLabel, toPLN } from '@/lib/text';

export async function categoryMetadata({
  category,
  path,
  title,
  lead,
}: {
  category: 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE' | null;
  path: string;
  title: string;
  lead: string;
}): Promise<Metadata> {
  const { count, minPrice } = await offersSummary(category);
  const from = minPrice ? ` od ${toPLN(minPrice)}` : '';
  const fullTitle = count ? `${title}: ${ofertyLabel(count)}${from}` : title;
  const stats = count ? ` ${ofertyLabel(count)}${minPrice ? `, ceny od ${toPLN(minPrice)}` : ''}.` : '';
  const description = `${lead}${stats} Kupujący nie płaci prowizji. M2 Nieruchomości, tel. 605 071 605.`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: 'website',
      siteName: 'M2 Nieruchomości',
      locale: 'pl_PL',
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'M2 Nieruchomości Bełchatów' }],
    },
  };
}
