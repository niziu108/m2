// src/app/(shop)/_components/CategoryPage.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';
import Filters from './Filters';
import Card from './Card';

export default async function CategoryPage({
  title,
  category,
  searchParams,
}: {
  title: string;
  category: 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE';
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const { q, pmin, pmax, amin, amax } = sp;

  const lat = sp.lat ? Number(sp.lat) : null;
  const lng = sp.lng ? Number(sp.lng) : null;
  const r   = sp.r   ? Number(sp.r)   : null;

  // liczby jako null gdy brak (żeby można było rzutować w SQL)
  const pminN = pmin ? Number(pmin) : null;
  const pmaxN = pmax ? Number(pmax) : null;
  const aminN = amin ? Number(amin) : null;
  const amaxN = amax ? Number(amax) : null;

  const where: any = { category };
  if (q) where.listingNumber = { contains: q };

  const aggr = await prisma.listing.aggregate({
    where: { category },
    _min: { price: true, area: true },
    _max: { price: true, area: true },
  });

  const priceMinDb = aggr._min.price ?? 0;
  const priceMaxDb = aggr._max.price ?? 0;
  const areaMinDb  = aggr._min.area  ?? 0;
  const areaMaxDb  = aggr._max.area  ?? 0;

  if (pminN != null || pmaxN != null) {
    where.price = { gte: pminN ?? undefined, lte: pmaxN ?? undefined };
  }
  if (aminN != null || amaxN != null) {
    where.area = { gte: aminN ?? undefined, lte: amaxN ?? undefined };
  }

  let items:
    { id:string; slug:string; title:string; coverImageUrl:string|null;
      price:number; area:number|null; bullets:string[]; isReserved:boolean;
      location:string|null; listingNumber:string; }[] = [];

  // Haversine po stronie DB, z rzutowaniem WSZYSTKICH parametrów
  if (lat != null && lng != null && r != null && !Number.isNaN(lat) && !Number.isNaN(lng) && !Number.isNaN(r)) {
    const rows = await prisma.$queryRaw<
      (typeof items[number] & { distance_km: number | null })[]
    >`
      SELECT
        l.id, l.slug, l.title, l."coverImageUrl", l.price, l.area, l.bullets, l."isReserved",
        l.location, l."listingNumber", l."sortIndex",
        CASE
          WHEN l.lat IS NOT NULL AND l.lng IS NOT NULL THEN
            6371 * acos(
              cos(radians(${lat}::float8)) * cos(radians(l.lat)) *
              cos(radians(l.lng) - radians(${lng}::float8)) +
              sin(radians(${lat}::float8)) * sin(radians(l.lat))
            )
          ELSE NULL
        END AS distance_km
      FROM "Listing" l
      WHERE l.category = ${category}::"Category"
        AND ( ${q ?? null}::text IS NULL OR l."listingNumber" ILIKE '%' || ${q ?? null}::text || '%' )
        AND ( ${pminN}::int4  IS NULL OR l.price >= ${pminN}::int4 )
        AND ( ${pmaxN}::int4  IS NULL OR l.price <= ${pmaxN}::int4 )
        AND ( ${aminN}::float8 IS NULL OR l.area  >= ${aminN}::float8 )
        AND ( ${amaxN}::float8 IS NULL OR l.area  <= ${amaxN}::float8 )
        AND (
          l.lat IS NOT NULL AND l.lng IS NOT NULL AND
          6371 * acos(
            cos(radians(${lat}::float8)) * cos(radians(l.lat)) *
            cos(radians(l.lng) - radians(${lng}::float8)) +
            sin(radians(${lat}::float8)) * sin(radians(l.lat))
          ) <= ${r}::float8
        )
      ORDER BY
        l."sortIndex" ASC,
        distance_km ASC NULLS LAST,
        l."createdAt" DESC
    `;
    items = rows.map(({ distance_km, ...keep }) => keep);
  } else {
    // Fallback: ręczna kolejność -> najnowsze
    items = await prisma.listing.findMany({
      where,
      orderBy: [
        { sortIndex: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true, slug: true, title: true, coverImageUrl: true,
        price: true, area: true, bullets: true, isReserved: true,
        location: true, listingNumber: true,
      },
    });
  }

  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9]">
      <section className="px-4 pt-8 pb-6 border-b border-[#E9C87D]/20">
        <h1 className="font-[Bungee] text-center text-[#E9C87D] tracking-[2px] text-[clamp(32px,6vw,72px)] mb-6">
          {title.toUpperCase()}
        </h1>
        <div className="max-w-3xl mx-auto">
          <Filters
            defaults={sp as any}
            limits={{
              priceMin: priceMinDb,
              priceMax: priceMaxDb,
              areaMin: Math.floor(areaMinDb || 0),
              areaMax: Math.ceil(areaMaxDb || 0),
            }}
          />
        </div>
      </section>

      <section className="px-4 py-6">
        <div className="mx-auto w-full max-w-[min(1400px,95vw)]">
          {items.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {items.map((l) => <Card key={l.id} l={l} />)}
            </div>
          ) : (
            <div className="py-24 flex items-center justify-center text-center">
              <h2 className="font-[Bungee] text-[#E9C87D] text-[clamp(22px,5vw,48px)] tracking-[2px] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                W TEJ KATEGORII NIE MAMY OFERT,<br />ZAPRASZAMY WKRÓTCE.
              </h2>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
