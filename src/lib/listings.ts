// src/lib/listings.ts
// Wspólne odczyty ofert dla stron miejscowości, wyceny, podobnych ofert i sitemapy.
import 'server-only';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import type { CardListing } from '@/app/(shop)/_components/Card';

export type ListingRow = CardListing & { shortDesc: string | null };

/** Wszystkie oferty w kolejności z panelu. Ofert są dziesiątki, więc filtrujemy je już w kodzie. */
export const getAllListings = cache(async (): Promise<ListingRow[]> => {
  return prisma.listing.findMany({
    orderBy: [{ sortIndex: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true, slug: true, title: true, coverImageUrl: true,
      price: true, area: true, bullets: true, isReserved: true,
      location: true, listingNumber: true, category: true, shortDesc: true,
    },
  });
});

/** Dokłada zdjęcia do karuzeli i usuwa opis, którego karta nie potrzebuje w przeglądarce. */
export async function toCards(rows: ListingRow[], photosPerCard = 6): Promise<CardListing[]> {
  const images = rows.length
    ? await prisma.image.findMany({
        where: { listingId: { in: rows.map((r) => r.id) } },
        select: { listingId: true, url: true },
        orderBy: { order: 'asc' },
      })
    : [];

  const byListing = new Map<string, string[]>();
  for (const im of images) {
    const arr = byListing.get(im.listingId) ?? [];
    arr.push(im.url);
    byListing.set(im.listingId, arr);
  }

  return rows.map(({ shortDesc: _unused, ...card }) => {
    const all = [card.coverImageUrl, ...(byListing.get(card.id) ?? [])].filter(Boolean) as string[];
    return { ...card, photos: Array.from(new Set(all)).slice(0, photosPerCard) };
  });
}

type Category = 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE';

/** Liczba ofert i najniższa cena do tytułu strony kategorii („28 ofert od 55 000 zł”). */
export const offersSummary = cache(async (category: Category | null) => {
  try {
    const where = category ? { category } : {};
    const [count, cheapest] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.aggregate({ where: { ...where, isReserved: false }, _min: { price: true } }),
    ]);
    return { count, minPrice: cheapest._min.price ?? null };
  } catch {
    // bez bazy tytuł zostaje bez liczb
    return { count: 0, minPrice: null };
  }
});
