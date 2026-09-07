// app/oferta/[slug]/page.tsx
export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Gallery from './Gallery';
import BackArrow from '@/components/BackArrow'; // ⬅️ DODANE
import ViewTracker from './ViewTracker';        // ⬅️ DODANE
import StructuredData from '@/components/StructuredData';
import { listingToJsonLd, breadcrumbJsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

// ── CONFIG ──────────────────────────────────────────────────────────────
// mapowanie kategorii -> strona kategorii (breadcrumby + typ oferty)
const CATEGORY_INFO: Record<string, { label: string; path: string; type: 'dom' | 'mieszkanie' | 'dzialka' | 'inne' }> = {
  DOM:        { label: 'Domy',       path: '/domy',       type: 'dom' },
  MIESZKANIE: { label: 'Mieszkania', path: '/mieszkania', type: 'mieszkanie' },
  DZIALKA:    { label: 'Działki',    path: '/dzialki',    type: 'dzialka' },
  INNE:       { label: 'Inne',       path: '/inne',       type: 'inne' },
};

// ── utils ───────────────────────────────────────────────────────────────
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function applyInlineTags(s: string) {
  let x = escapeHtml(s);
  x = x
    .replaceAll('[[gold]]', '<span class="gold-bungee">')
    .replaceAll('[[/gold]]', '</span>')
    .replaceAll('[[center]]', '<div class="center-block">')
    .replaceAll('[[/center]]', '</div>')
    .replaceAll('[[bold]]', '<strong>')
    .replaceAll('[[/bold]]', '</strong>');
  return x;
}
function renderShortDesc(src?: string) {
  if (!src) return '';
  return applyInlineTags(src).replace(/\n/g, '<br/>');
}
export function toPLN(n: number) {
  return n.toLocaleString('pl-PL') + ' zł';
}

// ── Metadata (Next 15: params to Promise) ───────────────────────────────
type GenProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GenProps): Promise<Metadata> {
  const { slug } = await params;

  // budujemy kanoniczny URL BEZ końcowego "/"
  const canonicalUrl = `${SITE_URL}/oferta/${slug}`;

  const l = await prisma.listing.findUnique({
    where: { slug },
    select: { title: true, shortDesc: true, coverImageUrl: true },
  });

  if (!l) {
    // fallback dla nieznalezionych (Next pokaże 404, ale meta też będzie spójna)
    return {
      title: 'Oferta',
      description: 'Szczegóły oferty w M2 Nieruchomości.',
      alternates: { canonical: canonicalUrl },
      openGraph: {
        url: canonicalUrl,
        title: 'Oferta | M2 Nieruchomości',
        description: 'Szczegóły oferty w M2 Nieruchomości.',
      },
    };
  }

  return {
    // brand dokleja szablon z layoutu, tu byłoby drugi raz
    title: l.title,
    description: l.shortDesc ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      url: canonicalUrl,
      title: `${l.title} | M2 Nieruchomości`,
      description: l.shortDesc ?? undefined,
      images: l.coverImageUrl ? [{ url: l.coverImageUrl }] : undefined,
    },
    // (opcjonalnie) Twitter — nie przeszkadza FB, a pomaga w X/Twitter Cards
    // twitter: {
    //   card: 'summary_large_image',
    //   title: `${l.title} | M2 Nieruchomości`,
    //   description: l.shortDesc ?? undefined,
    //   images: l.coverImageUrl ? [l.coverImageUrl] : undefined,
    // },
  };
}

// ── Page (Next 15: params to Promise) ───────────────────────────────────
type PageProps = { params: Promise<{ slug: string }> };

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const data = await prisma.listing.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!data) notFound();

  const pics = [
    ...(data.coverImageUrl ? [data.coverImageUrl] : []),
    ...data.images.map((i) => i.url),
  ];

  // "Liczba pokoi" tylko dla DOM/MIESZKANIE
  const showRooms = data.category === 'DOM' || data.category === 'MIESZKANIE';
  const roomsValue =
    (data as any).rooms ??
    (Array.isArray((data as any).bullets) && (data as any).bullets[0]) ??
    null;

  // ── DANE STRUKTURALNE (schema.org) ──────────────────────────────────────
  const cat = CATEGORY_INFO[data.category] ?? CATEGORY_INFO.INNE;
  const offerUrl = `${SITE_URL}/oferta/${data.slug}`;

  const jsonLdOffer = listingToJsonLd({
    id: String(data.id),
    slug: data.slug,
    title: data.title,
    description: data.shortDesc || undefined,
    type: cat.type,
    price: Number(data.price),
    currency: 'PLN',
    availability: data.isReserved ? 'LimitedAvailability' : 'InStock',
    areaM2: data.area || undefined,
    rooms: typeof roomsValue === 'number' ? roomsValue : undefined,
    address: {
      addressLocality: data.location || 'Bełchatów',
      addressRegion: 'łódzkie',
      addressCountry: 'PL',
    },
    geo: data.lat != null && data.lng != null ? { lat: data.lat, lng: data.lng } : undefined,
    images: pics,
    url: offerUrl,
    seller: {
      name: 'M2 Nieruchomości',
      telephone: '+48605071605',
      email: 'biuro@m2.nieruchomosci.pl',
    },
  });

  const jsonLdBreadcrumbs = breadcrumbJsonLd([
    { name: 'Strona główna', item: SITE_URL },
    { name: cat.label, item: `${SITE_URL}${cat.path}` },
    { name: data.title, item: offerUrl },
  ]);

  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <StructuredData jsonLd={[jsonLdOffer, jsonLdBreadcrumbs]} />
      <BackArrow /> {/* ⬅️ Złota strzałka powrotu */}
      
      <section className="px-0 sm:px-4 py-4 sm:py-6 mx-auto w-full max-w-[min(1400px,95vw)]">
        {/* TYTUŁ */}
        <h1 className="font-[Bungee] gold-grad text-center leading-tight px-14 sm:px-16 tracking-[0.5px] sm:tracking-[1px] md:tracking-[2px] text-[clamp(22px,5.2vw,56px)] mb-4 sm:mb-5 md:mb-6">
          {String(data.title).toUpperCase()}
        </h1>

        {/* GÓRA: galeria + panel info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start min-w-0">
          {/* LEWA KARTA = GALERIA */}
          <div className="sm:rounded-2xl border-0 sm:border sm:border-black/10 p-0 sm:p-3 md:p-4 sm:bg-[var(--surface)] h-full min-w-0">
            <Gallery images={pics} />

            {/* WIRTUALNY SPACER — pod galerią (tylko jeśli jest) */}
            {data.virtualTourUrl && (
              <div className="mt-3">
                <a
                  href={data.virtualTourUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto block w-full sm:w-auto text-center rounded-xl border px-5 py-2.5
                             border-[#E9C87D] text-[var(--gold-ink)] font-semibold tracking-wide select-none cursor-pointer"
                >
                  WIRTUALNY SPACER
                </a>
              </div>
            )}
          </div>

          {/* PRAWA KARTA = TABELA DANYCH */}
          <aside className="sm:rounded-2xl border-0 sm:border sm:border-black/10 px-3 py-2 sm:p-5 md:p-6 bg-[var(--surface)] h-full flex min-w-0">
            <div className="w-full flex flex-col gap-3 sm:gap-4 md:my-auto min-w-0">
              {/* CENA */}
              <div className="mb-1">
                <div className="text-xs tracking-wide uppercase opacity-70">Cena</div>
                <div className="font-[Bungee] gold-grad text-[clamp(20px,3.8vw,36px)] leading-tight">
                  {toPLN(data.price)}
                </div>
              </div>

              {/* TABELA */}
              <dl className="grid grid-cols-1 gap-2.5 sm:gap-3 text-sm min-w-0">
                <div className="flex justify-between items-center rounded-lg border border-black/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Powierzchnia</dt>
                  <dd className="font-medium truncate">{data.area ? `${data.area} m²` : '—'}</dd>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-black/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Lokalizacja</dt>
                  <dd className="font-medium truncate">{data.location ?? '—'}</dd>
                </div>

                {showRooms && (
                  <div className="flex justify-between items-center rounded-lg border border-black/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                    <dt className="opacity-70">Liczba pokoi</dt>
                    <dd className="font-medium truncate">{roomsValue ?? '—'}</dd>
                  </div>
                )}

                <div className="flex justify-between items-center rounded-lg border border-black/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Numer oferty</dt>
                  <dd className="font-medium truncate">{data.listingNumber ?? '—'}</dd>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-black/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Telefon</dt>
                  <dd className="font-medium truncate">{data.contactPhone ?? '—'}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* OPIS */}
        <div className="mt-7 md:mt-8 px-3 sm:px-0">
          {data.shortDesc && (
            <div
              className="desc text-base sm:text-lg leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: renderShortDesc(data.shortDesc) }}
            />
          )}
          {data.body && (
            <article className="prose prose-invert prose-base sm:prose-lg max-w-none mt-6">
              {data.body}
            </article>
          )}
        </div>

        {/* KARTA KONTAKTU DO TEJ OFERTY */}
        <div className="mt-8 md:mt-10">
          <div className="sm:rounded-2xl border-0 sm:border sm:border-[#E9C87D]/30 px-3 py-5 sm:p-6 md:p-8 bg-[var(--surface)] text-center">
            <h3 className="font-[Bungee] gold-grad mb-2 text-[clamp(18px,3vw,28px)]">
              Zainteresowała Cię ta oferta?
            </h3>
            <p className="text-[var(--foreground-soft)] mb-5 max-w-xl mx-auto">
              Zadzwoń lub napisz, chętnie umówimy oglądanie i odpowiemy na wszystkie pytania.
              {data.listingNumber ? ` Podaj numer oferty: ${data.listingNumber}.` : ''}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`tel:${(data.contactPhone ?? '605 071 605').replace(/\s+/g, '')}`}
                className="rounded-xl bg-[#E9C87D] text-[#131313] font-semibold px-6 py-3 select-none"
              >
                Zadzwoń: {data.contactPhone ?? '605 071 605'}
              </a>
              <a
                href={`mailto:${data.contactEmail ?? 'biuro@m2.nieruchomosci.pl'}?subject=${encodeURIComponent(
                  `Zapytanie o ofertę: ${data.title}${data.listingNumber ? ` (nr ${data.listingNumber})` : ''}`
                )}`}
                className="rounded-xl border border-[#E9C87D] text-[var(--gold-ink)] font-semibold px-6 py-3 select-none"
              >
                Napisz wiadomość
              </a>
            </div>
          </div>
        </div>

        {/* NAJCZĘSTSZE PYTANIA */}
        <div className="mt-8 md:mt-10">
          <div className="sm:rounded-2xl border-0 sm:border sm:border-black/10 px-3 py-5 sm:p-6 md:p-8 bg-[var(--surface)]">
            <h3 className="font-[Bungee] gold-grad mb-4 text-center text-[clamp(18px,3vw,28px)]">
              Najczęstsze pytania
            </h3>
            <div className="space-y-3 max-w-2xl mx-auto">
              {[
                {
                  q: 'Czy mogę umówić się na oglądanie tej nieruchomości?',
                  a: 'Tak. Zadzwoń lub napisz, a ustalimy dogodny termin, także w weekend. Dojeżdżamy na miejsce razem z Tobą.',
                },
                {
                  q: 'Czy cena podlega negocjacji?',
                  a: 'Warunki zawsze warto omówić bezpośrednio. Przekażemy Twoją propozycję właścicielowi i pomożemy dojść do porozumienia.',
                },
                {
                  q: 'Ile kosztuje pomoc biura przy zakupie?',
                  a: 'Wynagrodzenie ustalamy jasno i z góry, bez ukrytych kosztów. Szczegóły przedstawimy przy kontakcie.',
                },
                {
                  q: 'Pomożecie z formalnościami i dokumentami?',
                  a: 'Tak. Prowadzimy Cię przez cały proces, od rezerwacji po akt notarialny, i pomagamy skompletować dokumenty.',
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-black/10 px-4 py-3 bg-[var(--background)]"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-semibold select-none">
                    <span>{item.q}</span>
                    <span className="text-[var(--gold-ink)] transition-transform group-open:rotate-45 text-2xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--foreground-soft)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-5 text-center text-sm">
              <a href="/faq" className="text-[var(--gold-ink)] underline underline-offset-4 select-none">
                Zobacz wszystkie pytania
              </a>
            </p>
          </div>
        </div>

        <ViewTracker listingId={data.id.toString()} /> {/* ⬅️ DODANE */}
      </section>
    </main>
  );
}
