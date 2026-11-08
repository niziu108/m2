import Link from 'next/link';
import BackArrow from '@/components/BackArrow';
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import Card, { type CardListing } from '@/app/(shop)/_components/Card';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';
import { statTiles } from '@/lib/offerStats';
import { ofertyLabel } from '@/lib/text';

const PHONE = '605 071 605';
const PHONE_HREF = 'tel:+48605071605';

/* Wspólny wygląd stron miejscowości i rodzajów działek: nagłówek, liczby z aktualnych ofert,
   lista ofert i linki do sąsiednich stron. Treść i oferty przychodzą z konkretnej strony. */
export default function LandingPage({
  path,
  crumbs,
  phrase,
  heading,
  lead,
  items,
  searchNote,
  sellNote,
  related,
}: {
  path: string;
  crumbs: Crumb[];
  phrase: string; // mała fraza nad nagłówkiem, ta sama co w tytule w Google
  heading: string;
  lead: string[];
  items: CardListing[];
  searchNote: string;
  sellNote: string;
  related: { label: string; href: string }[];
}) {
  const tiles = statTiles(items);

  const jsonLd = [
    breadcrumbJsonLd(
      crumbs.map((c) => ({ name: c.name, item: `${SITE_URL}${c.href ?? path}` }))
    ),
    ...(items.length ? [itemListJsonLd(items, SITE_URL)] : []),
  ];

  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)]">
      <StructuredData jsonLd={jsonLd} />
      <BackArrow fallbackHref="/nieruchomosci" />

      <section className="px-4 pt-16 pb-6 sm:pt-20 border-b border-[#E9C87D]/20">
        <div className="mx-auto w-full max-w-[min(1180px,95vw)]">
          <Breadcrumbs items={crumbs} className="mb-4" />

          <h1>
            <span className="block mb-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
              {phrase}
            </span>
            <span className="block font-display text-[var(--ink)] leading-tight text-[clamp(34px,5.6vw,56px)]">
              {heading}
            </span>
          </h1>

          <div className="mt-4 max-w-3xl space-y-3 text-[15px] sm:text-base leading-relaxed text-[var(--foreground-soft)]">
            {lead.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {items.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 md:flex md:flex-wrap">
              {tiles.map((t) => (
                <div
                  key={t.label}
                  className="rounded-xl border border-black/10 bg-[var(--surface)] px-3.5 py-2.5 md:min-w-[170px]"
                >
                  <dt className="text-[12px] text-[var(--foreground-soft)]">{t.label}</dt>
                  <dd className="font-display text-[var(--ink)] text-[22px] sm:text-[25px] leading-tight">{t.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="px-4 pt-5 pb-8">
        <div className="mx-auto w-full max-w-[min(1180px,95vw)]">
          {items.length ? (
            <>
              <p className="mb-4 text-sm text-[var(--foreground-soft)]">{ofertyLabel(items.length)}</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-1">
                {items.map((l, i) => (
                  <Card key={l.id} l={l} priority={i === 0} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <h2 className="font-display text-[var(--ink)] text-[clamp(26px,4vw,36px)] leading-tight">
                W tej chwili nie mamy tu ofert
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[var(--foreground-soft)]">
                Zobacz wszystkie aktualne nieruchomości albo zadzwoń: możemy szukać dla Ciebie na bieżąco.
              </p>
              <Link
                href="/nieruchomosci"
                className="mt-5 inline-block rounded-xl bg-[#E9C87D] px-5 py-2.5 font-semibold !text-[#2a2117]"
              >
                Zobacz wszystkie oferty
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid w-full max-w-[min(1180px,95vw)] gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-[var(--surface)] p-5 sm:p-6">
            <h2 className="font-display text-[var(--ink)] text-[26px] sm:text-[30px] leading-tight">
              Szukasz czegoś konkretnego?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-soft)]">{searchNote}</p>
            <a
              href={PHONE_HREF}
              className="mt-4 inline-block rounded-xl bg-[#E9C87D] px-5 py-2.5 font-semibold !text-[#2a2117]"
            >
              Zadzwoń: {PHONE}
            </a>
          </div>

          <div className="rounded-2xl border border-black/10 bg-[var(--surface)] p-5 sm:p-6">
            <h2 className="font-display text-[var(--ink)] text-[26px] sm:text-[30px] leading-tight">
              Masz coś do sprzedania?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-soft)]">{sellNote}</p>
            <Link
              href="/wycena-nieruchomosci"
              className="mt-4 inline-block rounded-xl border border-[#E9C87D] px-5 py-2.5 font-semibold !text-[var(--gold-ink)]"
            >
              Bezpłatna wycena
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <nav aria-label="Zobacz również" className="mx-auto mt-8 w-full max-w-[min(1180px,95vw)]">
            <h2 className="font-display text-[var(--ink)] text-[24px] leading-tight">Zobacz również</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    prefetch={false}
                    className="inline-block rounded-full border border-black/12 bg-[var(--surface)] px-3.5 py-1.5 text-[14px] !text-[var(--foreground)] transition hover:border-[#b8913a]"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </main>
  );
}
