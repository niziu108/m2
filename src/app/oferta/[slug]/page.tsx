// app/oferta/[slug]/page.tsx
export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Gallery from './Gallery';
import MortgageCalculator from './MortgageCalculator';
import BackArrow from '@/components/BackArrow'; // ⬅️ DODANE
import ViewTracker from './ViewTracker';        // ⬅️ DODANE

// ── CONFIG ──────────────────────────────────────────────────────────────
// Używamy bez slasha na końcu. Podmień, jeśli masz inną domenę.
const SITE_URL = 'https://m2.nieruchomosci.pl';

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
      title: 'Oferta | M2 Nieruchomości',
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
    title: `${l.title} | M2 Nieruchomości`,
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

  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] overflow-x-hidden">
      <BackArrow /> {/* ⬅️ Złota strzałka powrotu */}
      
      <section className="px-3 sm:px-4 py-5 sm:py-6 mx-auto w-full max-w-[min(1400px,95vw)]">
        {/* TYTUŁ */}
        <h1 className="font-[Bungee] text-center text-[#E9C87D] tracking-[0.5px] sm:tracking-[1px] md:tracking-[2px] text-[clamp(22px,5.2vw,56px)] mb-4 sm:mb-5 md:mb-6">
          {String(data.title).toUpperCase()}
        </h1>

        {/* GÓRA: galeria + panel info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start min-w-0">
          {/* LEWA KARTA = GALERIA */}
          <div className="rounded-2xl border border-white/10 p-2.5 sm:p-3 md:p-4 bg-black/20 h-full min-w-0">
            <Gallery images={pics} />

            {/* WIRTUALNY SPACER — pod galerią (tylko jeśli jest) */}
            {data.virtualTourUrl && (
              <div className="mt-3">
                <a
                  href={data.virtualTourUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto block w-full sm:w-auto text-center rounded-xl border px-5 py-2.5
                             border-[#E9C87D] text-[#E9C87D] font-semibold tracking-wide select-none cursor-pointer"
                >
                  WIRTUALNY SPACER
                </a>
              </div>
            )}
          </div>

          {/* PRAWA KARTA = TABELA DANYCH */}
          <aside className="rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 bg-black/20 h-full flex min-w-0">
            <div className="w-full flex flex-col gap-3 sm:gap-4 md:my-auto min-w-0">
              {/* CENA */}
              <div className="mb-1">
                <div className="text-xs tracking-wide uppercase opacity-70">Cena</div>
                <div className="font-[Bungee] text-[#E9C87D] text-[clamp(20px,3.8vw,36px)] leading-tight">
                  {toPLN(data.price)}
                </div>
              </div>

              {/* TABELA */}
              <dl className="grid grid-cols-1 gap-2.5 sm:gap-3 text-sm min-w-0">
                <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Powierzchnia</dt>
                  <dd className="font-medium truncate">{data.area ? `${data.area} m²` : '—'}</dd>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Lokalizacja</dt>
                  <dd className="font-medium truncate">{data.location ?? '—'}</dd>
                </div>

                {showRooms && (
                  <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                    <dt className="opacity-70">Liczba pokoi</dt>
                    <dd className="font-medium truncate">{roomsValue ?? '—'}</dd>
                  </div>
                )}

                <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Numer oferty</dt>
                  <dd className="font-medium truncate">{data.listingNumber ?? '—'}</dd>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">Telefon</dt>
                  <dd className="font-medium truncate">{data.contactPhone ?? '—'}</dd>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-white/10 px-3 py-2.5 md:px-4 md:py-3 min-w-0">
                  <dt className="opacity-70">E-mail</dt>
                  <dd className="font-medium truncate">{data.contactEmail ?? '—'}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* OPIS */}
        <div className="mt-7 md:mt-8">
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

        {/* KALKULATOR */}
        <div className="mt-8 md:mt-10">
          <div className="rounded-2xl border border-white/10 p-4 sm:p-5 md:p-6 bg-black/20">
            <h3 className="font-[Bungee] text-[#E9C87D] mb-3 text-center">
              Symulacja raty kredytu
            </h3>
            <MortgageCalculator price={data.price} />
          </div>
        </div>

        <ViewTracker listingId={data.id.toString()} /> {/* ⬅️ DODANE */}
      </section>
    </main>
  );
}
