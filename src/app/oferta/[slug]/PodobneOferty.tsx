import Link from 'next/link';
import Card from '@/app/(shop)/_components/Card';
import type { ListingRow } from '@/lib/listings';
import { placeOf } from '@/lib/places';

const ILE = 4;

/* Podobne oferty pod ofertą: kto nie kupi tej działki, ogląda kolejną zamiast wracać do Google,
   a każda oferta dostaje linki z innych ofert. Najpierw ta sama kategoria i gmina, potem cena. */
export default function PodobneOferty({
  current,
  all,
  category,
}: {
  current: { id: string; category: string; title: string; price: number; location: string | null };
  all: ListingRow[];
  category: { label: string; path: string };
}) {
  const place = placeOf(current.location);

  // działka wrzucona do „Inne” dalej jest działką: nie podsuwamy przy niej mieszkań
  const kindOf = (l: { category?: string | null; title: string }) =>
    l.category === 'INNE' && /działk/i.test(l.title) ? 'DZIALKA' : l.category;
  const currentKind = kindOf(current);

  const score = (l: ListingRow) => {
    let s = Math.abs(l.price - current.price) / Math.max(current.price, 1);
    if (kindOf(l) !== currentKind) s += 10;
    if (place && placeOf(l.location)?.slug === place.slug) s -= 5;
    if (l.isReserved) s += 1;
    return s;
  };

  // bez kilku kart z tej samej inwestycji (ten sam tytuł), także tej oglądanej
  const seen = new Set<string>([current.title.trim().toLowerCase()]);
  const items = all
    .filter((l) => l.id !== current.id)
    .sort((a, b) => score(a) - score(b))
    .filter((l) => {
      const key = l.title.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, ILE)
    .map(({ shortDesc: _unused, ...card }) => card);

  if (!items.length) return null;

  return (
    <div className="mt-8 md:mt-10 px-3 sm:px-0">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-[var(--ink)] text-[clamp(26px,3.6vw,36px)] leading-tight">
          Podobne oferty
        </h2>
        <p className="text-sm">
          {place && (
            <>
              <Link
                href={`/nieruchomosci/${place.slug}`}
                prefetch={false}
                className="!text-[var(--gold-ink)] underline underline-offset-4"
              >
                Wszystkie: {place.name}
              </Link>
              <span className="mx-2 opacity-40">|</span>
            </>
          )}
          <Link href={category.path} prefetch={false} className="!text-[var(--gold-ink)] underline underline-offset-4">
            {category.label}
          </Link>
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {items.map((l, i) => (
          // na telefonie 3 karty, żeby nie przewijać w nieskończoność
          <div key={l.id} className={i >= 3 ? 'hidden sm:block' : undefined}>
            <Card l={l} stacked />
          </div>
        ))}
      </div>
    </div>
  );
}
