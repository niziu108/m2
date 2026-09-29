import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Card, { type CardListing } from '@/app/(shop)/_components/Card';

/* Oferty na stronie głównej: prawdziwe nieruchomości zamiast samych kafli kategorii.
   Kolejność taka jak na liście (ręczna kolejność z panelu, potem najnowsze),
   więc to, co Karina ustawi na górze, jest też tutaj. Render po stronie serwera,
   żeby Google widział linki do ofert w HTML strony głównej. */

const ILE = 6;
const ZDJEC_NA_KARTE = 6;

const KATEGORIE = [
  { key: 'DOM', label: 'Domy', href: '/domy' },
  { key: 'MIESZKANIE', label: 'Mieszkania', href: '/mieszkania' },
  { key: 'DZIALKA', label: 'Działki', href: '/dzialki' },
  { key: 'INNE', label: 'Inne', href: '/inne' },
] as const;

function ofertyLabel(n: number) {
  if (n === 1) return '1 oferta';
  const last = n % 10;
  const twoLast = n % 100;
  const few = last >= 2 && last <= 4 && !(twoLast >= 12 && twoLast <= 14);
  return `${n} ${few ? 'oferty' : 'ofert'}`;
}

export default async function NajnowszeOferty() {
  let items: CardListing[] = [];
  let total = 0;
  const perCat = new Map<string, number>();

  try {
    const [rows, groups] = await Promise.all([
      prisma.listing.findMany({
        orderBy: [{ sortIndex: 'asc' }, { createdAt: 'desc' }],
        take: ILE * 3,
        select: {
          id: true, slug: true, title: true, coverImageUrl: true,
          price: true, area: true, bullets: true, isReserved: true,
          location: true, listingNumber: true, category: true,
        },
      }),
      prisma.listing.groupBy({ by: ['category'], _count: { _all: true } }),
    ]);

    for (const g of groups) {
      perCat.set(g.category, g._count._all);
      total += g._count._all;
    }

    const imgs = rows.length
      ? await prisma.image.findMany({
          where: { listingId: { in: rows.map((r) => r.id) } },
          select: { listingId: true, url: true },
          orderBy: { order: 'asc' },
        })
      : [];
    const byListing = new Map<string, string[]>();
    for (const im of imgs) {
      const arr = byListing.get(im.listingId) ?? [];
      arr.push(im.url);
      byListing.set(im.listingId, arr);
    }
    // bez dwóch identycznych kart obok siebie (np. kilka działek z jednej inwestycji)
    const seen = new Set<string>();
    const unikalne = rows.filter((r) => {
      const k = r.title.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, ILE);

    items = unikalne.map((l) => {
      const all = [l.coverImageUrl, ...(byListing.get(l.id) ?? [])].filter(Boolean) as string[];
      return { ...l, photos: Array.from(new Set(all)).slice(0, ZDJEC_NA_KARTE) };
    });
  } catch {
    // baza chwilowo niedostępna: sekcja znika, reszta strony działa
    return null;
  }

  if (!items.length) return null;

  return (
    <section
      id="oferta"
      aria-labelledby="oferta-tytul"
      className="w-full bg-[var(--surface)] py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-[min(1240px,94vw)]">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">Aktualna oferta</span>
          <h2 id="oferta-tytul" className="section-title mt-3">
            Nieruchomości na sprzedaż
          </h2>
          <span className="gold-rule mt-5" aria-hidden />
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--foreground-soft)] md:text-[16px]">
            {total > 0 ? `${ofertyLabel(total)} w Bełchatowie i okolicy. ` : ''}
            Każdą nieruchomość oglądaliśmy osobiście, a kupujący nie płaci u nas prowizji.
          </p>
        </div>

        {/* kategorie z liczbą ofert */}
        <nav aria-label="Kategorie ofert" className="mt-8 flex flex-wrap justify-center gap-2.5">
          {KATEGORIE.map((k) => (
            <Link
              key={k.key}
              href={k.href}
              className="rounded-full border border-black/12 bg-[var(--background)] px-4 py-2 text-[14px] font-medium !text-[var(--foreground)] transition hover:border-[#b8913a]"
            >
              {k.label}
              {perCat.get(k.key) ? (
                <span className="ml-1.5 tabular-nums text-[var(--foreground-soft)]">{perCat.get(k.key)}</span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((l, i) => (
            // na telefonie 4 karty, żeby nie przewijać 3000 px do opinii
            <div key={l.id} className={i >= 4 ? 'hidden sm:block' : undefined}>
              <Card l={l} stacked />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/nieruchomosci"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-8 py-3.5 text-[15px] font-semibold !text-white transition hover:!opacity-90"
          >
            Zobacz wszystkie oferty{total > 0 ? ` (${total})` : ''}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
