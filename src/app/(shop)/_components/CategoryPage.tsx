// src/app/(shop)/_components/CategoryPage.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Filters from './Filters';
import Card from './Card';
import StructuredData from '@/components/StructuredData';
import { breadcrumbJsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

// mapa kategorii -> ścieżka + etykieta (linkowanie wewnętrzne)
const CATS: { key: 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE'; label: string; path: string }[] = [
  { key: 'DOM',        label: 'Domy',       path: '/domy' },
  { key: 'MIESZKANIE', label: 'Mieszkania', path: '/mieszkania' },
  { key: 'DZIALKA',    label: 'Działki',    path: '/dzialki' },
  { key: 'INNE',       label: 'Inne',       path: '/inne' },
];

// Teksty SEO pod frazy lokalne (naturalne, bez upychania)
const SEO_COPY: Record<string, { h2: string; paras: string[] }> = {
  DOM: {
    h2: 'Domy na sprzedaż w Bełchatowie i okolicy',
    paras: [
      'Szukasz domu na sprzedaż w Bełchatowie lub okolicznych miejscowościach? W M2 Nieruchomości znajdziesz aktualne oferty domów jednorodzinnych, parterowych i z ogrodem, z realnymi zdjęciami i pełnym opisem. Każdą nieruchomość oglądamy osobiście, więc to co widzisz w ofercie zgadza się ze stanem faktycznym.',
      'Działamy na terenie Bełchatowa i powiatu bełchatowskiego, w promieniu do 40 km. Jako biuro mobilne dojedziemy do Ciebie i pokażemy dom w dogodnym terminie, także w weekend. Jeśli chcesz sprzedać dom, pomożemy w wycenie i poprowadzimy całą transakcję.',
    ],
  },
  MIESZKANIE: {
    h2: 'Mieszkania na sprzedaż w Bełchatowie',
    paras: [
      'Przeglądasz mieszkania na sprzedaż w Bełchatowie? Zebraliśmy dla Ciebie aktualne oferta z cenami, metrażami i liczbą pokoi. Filtry po cenie, powierzchni i lokalizacji pomogą szybko znaleźć mieszkanie dopasowane do Twoich potrzeb i budżetu.',
      'Kupujesz albo sprzedajesz mieszkanie? Doradzimy przy wycenie, przygotowaniu oferty i formalnościach. Obsługujemy Bełchatów i okolice, a kontakt z nami jest możliwy przez siedem dni w tygodniu.',
    ],
  },
  DZIALKA: {
    h2: 'Działki na sprzedaż w Bełchatowie i powiecie bełchatowskim',
    paras: [
      'Działki budowlane, rolne i rekreacyjne na sprzedaż w Bełchatowie i okolicy. W ofertach znajdziesz powierzchnię, lokalizację i cenę, a w razie pytań o warunki zabudowy czy media pomożemy je wyjaśnić przed zakupem.',
      'Planujesz sprzedaż działki? Wycenimy grunt i znajdziemy kupca. Znamy lokalny rynek powiatu bełchatowskiego, dlatego dobierzemy realną cenę i skrócimy czas sprzedaży.',
    ],
  },
  INNE: {
    h2: 'Pozostałe nieruchomości na sprzedaż w Bełchatowie',
    paras: [
      'W tej sekcji zebraliśmy pozostałe nieruchomości: lokale użytkowe, obiekty komercyjne i oferty, które nie mieszczą się w standardowych kategoriach. Wszystkie dotyczą Bełchatowa i okolicy.',
      'Masz nietypową nieruchomość do sprzedania? Skontaktuj się z nami, pomożemy z wyceną i sprzedażą niezależnie od rodzaju obiektu.',
    ],
  },
};

// Małe, ładne nagłówki na stronach wyszukiwarki
const SEARCH_HEADING: Record<string, string> = {
  DOM: 'Znajdź swój dom',
  MIESZKANIE: 'Znajdź swoje mieszkanie',
  DZIALKA: 'Znajdź swoją działkę',
  INNE: 'Znajdź swoją nieruchomość',
};

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

  const seo = SEO_COPY[category] ?? SEO_COPY.INNE;
  const selfPath = CATS.find((c) => c.key === category)?.path ?? '/';
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Strona główna', item: SITE_URL },
    { name: title, item: `${SITE_URL}${selfPath}` },
  ]);

  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)]">
      <StructuredData jsonLd={breadcrumb} />
      <section className="px-4 pt-8 pb-6 border-b border-[#E9C87D]/20">
        <h1 className="font-[Bungee] gold-grad text-center tracking-[0.5px] leading-tight px-14 sm:px-16 text-[clamp(22px,4.2vw,40px)] mb-6">
          {SEARCH_HEADING[category] ?? 'Znajdź nieruchomość'}
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
              <h2 className="font-[Bungee] gold-grad text-[clamp(22px,5vw,48px)] tracking-[2px] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                W TEJ KATEGORII NIE MAMY OFERT,<br />ZAPRASZAMY WKRÓTCE.
              </h2>
            </div>
          )}
        </div>
      </section>

      {/* SEKCJA SEO + LINKOWANIE WEWNĘTRZNE */}
      <section className="px-4 pb-16 pt-4 border-t border-black/5">
        <div className="mx-auto w-full max-w-3xl text-[var(--foreground-soft)]">
          <h2 className="font-[Bungee] gold-grad text-[clamp(18px,3.6vw,28px)] tracking-[1px] mb-4">
            {seo.h2}
          </h2>
          <div className="space-y-3 text-sm sm:text-base leading-relaxed">
            {seo.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="opacity-60">Zobacz również:</span>
            {CATS.filter((c) => c.key !== category).map((c) => (
              <Link
                key={c.key}
                href={c.path}
                className="text-[var(--gold-ink)] underline underline-offset-4 hover:opacity-80"
              >
                {c.label}
              </Link>
            ))}
            <Link href="/faq" className="text-[var(--gold-ink)] underline underline-offset-4 hover:opacity-80">
              Najczęstsze pytania
            </Link>
            <Link href="/#kontakt" className="text-[var(--gold-ink)] underline underline-offset-4 hover:opacity-80">
              Kontakt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
