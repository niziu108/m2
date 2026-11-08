export const runtime = 'nodejs';
// Ceny za metr liczone z aktualnych ofert, odświeżane co godzinę
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import BackArrow from '@/components/BackArrow';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';
import { getAllListings, type ListingRow } from '@/lib/listings';
import { medianPerM2 } from '@/lib/offerStats';
import { normalizePl } from '@/lib/places';
import { PLOT_KINDS } from '@/lib/plotKinds';
import { PLACE_LINKS } from '@/lib/popularLinks';
import { breadcrumbJsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';
import { ofertyLabel } from '@/lib/text';

const PATH = '/wycena-nieruchomosci';
const TITLE = 'Wycena nieruchomości Bełchatów: bezpłatna wycena domu, mieszkania i działki';
const DESCRIPTION =
  'Bezpłatna wstępna wycena domu, mieszkania lub działki w Bełchatowie i okolicy do 40 km. Oglądamy nieruchomość na miejscu i mówimy, jaka cena jest realna. Aktualne ceny za m². Tel. 605 071 605.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: 'M2 Nieruchomości',
    locale: 'pl_PL',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'M2 Nieruchomości Bełchatów' }],
  },
};

const STEPS = [
  {
    t: 'Rozmowa',
    d: 'Dzwonisz albo piszesz. Pytamy o adres, metraż i stan nieruchomości, a termin spotkania ustalamy od razu, także wieczorem lub w weekend.',
  },
  {
    t: 'Oględziny na miejscu',
    d: 'Przyjeżdżamy i oglądamy nieruchomość osobiście, bo stanu technicznego ani otoczenia nie widać na zdjęciach.',
  },
  {
    t: 'Porównanie z rynkiem',
    d: 'Opieramy się na realnych cenach transakcyjnych w Bełchatowie i okolicy oraz na stanie i lokalizacji Twojej nieruchomości.',
  },
  {
    t: 'Konkretna cena',
    d: 'Mówimy, jaka cena jest realna i co może przyspieszyć sprzedaż. Dobrze dobrana cena skraca czas sprzedaży i chroni przed zaniżeniem wartości.',
  },
];

const FACTORS = [
  {
    t: 'Mieszkanie',
    items: ['osiedle i otoczenie', 'metraż i układ pokoi', 'piętro i winda', 'stan budynku i wykończenie', 'balkon, loggia, piwnica, miejsce postojowe'],
  },
  {
    t: 'Dom',
    items: ['stan techniczny i rok budowy', 'stan wykończenia', 'ogrzewanie i koszty utrzymania', 'wielkość działki i garaż', 'dojazd i media'],
  },
  {
    t: 'Działka',
    items: ['plan miejscowy lub warunki zabudowy', 'dojazd i rodzaj drogi', 'prąd, woda, gaz, kanalizacja', 'kształt i szerokość działki', 'otoczenie i odległość od miasta'],
  },
];

const AFTER = [
  'Profesjonalne zdjęcia, film i wirtualny spacer',
  'Publikacja na Otodom, OLX, Facebooku, tylkodzialki.pl i naszej stronie oraz w bazie klientów poszukujących',
  'Prezentacje, negocjacje i pomoc w dokumentach, aż po akt notarialny',
];

const FAQ = [
  {
    q: 'Ile kosztuje wycena nieruchomości?',
    a: 'Wstępną wycenę robimy bezpłatnie. Warunki ewentualnej dalszej współpracy poznajesz przed podpisaniem umowy, bez ukrytych kosztów.',
  },
  {
    q: 'Czy po wycenie muszę sprzedawać przez Wasze biuro?',
    a: 'Nie. Wstępna wycena do niczego nie zobowiązuje. O tym, czy i z kim sprzedajesz, decydujesz po rozmowie z nami.',
  },
  {
    q: 'Czym wycena w biurze różni się od operatu szacunkowego?',
    a: 'Wycena w biurze to nasza opinia o realnej cenie sprzedaży, oparta na znajomości lokalnego rynku. Operat szacunkowy to dokument sporządzany przez rzeczoznawcę majątkowego, wymagany np. w niektórych sprawach urzędowych i sądowych. Jeśli Twoja sprawa go wymaga, powiemy Ci o tym od razu.',
  },
  {
    q: 'Jakie dokumenty przygotować?',
    a: 'Do wstępnej wyceny wystarczą podstawowe dane o nieruchomości. Do sprzedaży zwykle potrzebny jest akt własności i numer księgi wieczystej. Dokładną listę dopasujemy do konkretnej sprawy i pomożemy ją skompletować.',
  },
  {
    q: 'Gdzie robicie wyceny?',
    a: 'W Bełchatowie oraz w całym powiecie bełchatowskim i okolicy, w promieniu do około 40 km. Jesteśmy biurem mobilnym, więc przyjeżdżamy na miejsce.',
  },
  {
    q: 'Ile kosztuje sprzedaż przez biuro?',
    a: 'Wysokość wynagrodzenia biura ustalamy indywidualnie i zawsze jasno, przed podpisaniem umowy. Kupujący nie płaci u nas prowizji.',
  },
];

/** Co najmniej 3 oferty, żeby jedna nietypowa nieruchomość nie zmieniała wyniku. */
const MIN_SAMPLE = 3;

function priceRow(label: string, rows: ListingRow[]) {
  const withArea = rows.filter((r) => r.area && r.area > 0 && r.price > 0);
  const perM2 = medianPerM2(withArea);
  if (withArea.length < MIN_SAMPLE || perM2 == null) return null;
  const values = withArea.map((r) => Math.round(r.price / r.area!));
  return {
    label,
    perM2,
    min: Math.min(...values),
    max: Math.max(...values),
    count: withArea.length,
  };
}

async function loadPrices() {
  try {
    const all = await getAllListings();
    const inBelchatow = (r: ListingRow) => normalizePl(r.location ?? '').includes('belchatow');
    return [
      priceRow('Mieszkania w Bełchatowie', all.filter((r) => r.category === 'MIESZKANIE' && inBelchatow(r))),
      priceRow('Domy w Bełchatowie i okolicy', all.filter((r) => r.category === 'DOM')),
      priceRow('Działki budowlane w okolicy', all.filter(PLOT_KINDS[0].matches)),
    ].filter((row): row is NonNullable<typeof row> => !!row);
  } catch {
    // bez bazy sekcja z cenami znika, reszta strony działa
    return [];
  }
}

const zl = (n: number) => n.toLocaleString('pl-PL');

export default async function Page() {
  const prices = await loadPrices();
  const month = new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });

  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'Strona główna', item: SITE_URL },
      { name: 'Wycena nieruchomości', item: `${SITE_URL}${PATH}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Bezpłatna wstępna wycena nieruchomości',
      serviceType: 'Wycena nieruchomości',
      url: `${SITE_URL}${PATH}`,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'City', name: 'Bełchatów' },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'PLN' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  const h2 = 'font-display text-[var(--ink)] text-[clamp(28px,4.4vw,42px)] leading-tight';
  const primaryBtn = 'inline-block rounded-xl bg-[#E9C87D] px-6 py-3 font-semibold !text-[#2a2117]';
  const secondaryBtn = 'inline-block rounded-xl border border-[#E9C87D] px-6 py-3 font-semibold !text-[var(--gold-ink)]';

  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)]">
      <StructuredData jsonLd={jsonLd} />
      <BackArrow />

      {/* NAGŁÓWEK */}
      <section className="px-4 pt-16 pb-10 sm:pt-20 border-b border-[#E9C87D]/20">
        <div className="mx-auto w-full max-w-4xl">
          <Breadcrumbs
            items={[{ name: 'Strona główna', href: '/' }, { name: 'Wycena nieruchomości' }]}
            className="mb-4"
          />
          <h1>
            <span className="block mb-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
              Wycena nieruchomości Bełchatów
            </span>
            <span className="block font-display text-[var(--ink)] leading-tight text-[clamp(36px,6vw,62px)]">
              Ile warta jest Twoja nieruchomość?
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[var(--foreground-soft)]">
            Zanim wystawisz dom, mieszkanie albo działkę na sprzedaż, dowiedz się, jaka cena jest realna.
            Wstępną wycenę robimy bezpłatnie, w Bełchatowie i okolicy do 40 km.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="tel:+48605071605" className={primaryBtn}>Zadzwoń: 605 071 605</a>
            <a
              href={`mailto:biuro@m2.nieruchomosci.pl?subject=${encodeURIComponent('Wycena nieruchomości')}`}
              className={secondaryBtn}
            >
              Napisz wiadomość
            </a>
          </div>
        </div>
      </section>

      {/* CENY Z AKTUALNYCH OFERT */}
      {prices.length > 0 && (
        <section className="px-4 py-12 bg-[var(--surface)]">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className={h2}>Ceny za metr w naszych aktualnych ofertach</h2>
            <p className="mt-2 text-[15px] text-[var(--foreground-soft)]">Stan na {month}.</p>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {prices.map((p) => (
                <li key={p.label} className="rounded-2xl border border-black/10 bg-[var(--background)] p-5">
                  <div className="text-[14px] font-semibold text-[var(--foreground)]">{p.label}</div>
                  <div className="mt-2 font-display gold-grad text-[34px] leading-none">{zl(p.perM2)} zł/m²</div>
                  <div className="mt-2 text-[13px] leading-snug text-[var(--foreground-soft)]">
                    Od {zl(p.min)} do {zl(p.max)} zł/m², na podstawie: {ofertyLabel(p.count)}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--foreground-soft)]">
              Duża liczba to mediana, czyli środkowa cena z ofert. To ceny ofertowe, a nie transakcyjne, liczone
              wyłącznie z ofert M2 Nieruchomości. Pokazują orientacyjny poziom cen i nie zastępują wyceny konkretnej
              nieruchomości.
            </p>
          </div>
        </section>
      )}

      {/* JAK WYGLĄDA */}
      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className={h2}>Jak wygląda wycena</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-black/10 bg-[var(--surface)] p-5">
                <div className="font-display text-[#b8913a] text-[30px] leading-none">{i + 1}.</div>
                <h3 className="mt-2 font-semibold text-[17px]">{s.t}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--foreground-soft)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CO WPŁYWA NA CENĘ */}
      <section className="px-4 py-12 bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className={h2}>Co najbardziej wpływa na cenę</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {FACTORS.map((f) => (
              <div key={f.t} className="rounded-2xl border border-black/10 bg-[var(--background)] p-5">
                <h3 className="font-semibold text-[17px]">{f.t}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[var(--foreground-soft)]">
                  {f.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PO WYCENIE */}
      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className={h2}>Chcesz sprzedać? Zajmiemy się resztą</h2>
          <ul className="mt-5 space-y-2.5 text-[16px] leading-relaxed">
            {AFTER.map((a) => (
              <li key={a} className="flex gap-2.5">
                <span aria-hidden className="mt-[3px] text-[#b8913a]">&#10003;</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PYTANIA */}
      <section className="px-4 py-12 bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className={`${h2} text-center`}>Najczęstsze pytania o wycenę</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl border border-black/10 bg-[var(--background)] px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold select-none">
                  <span>{item.q}</span>
                  <span className="text-2xl leading-none text-[var(--gold-ink)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-soft)]">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-5 text-center text-sm">
            <Link href="/faq" className="!text-[var(--gold-ink)] underline underline-offset-4">
              Zobacz wszystkie pytania
            </Link>
          </p>
        </div>
      </section>

      {/* KONIEC */}
      <section className="px-4 py-14 text-center">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className={h2}>Sprawdź, za ile możesz sprzedać</h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--foreground-soft)]">
            Wystarczy jeden telefon. Odbieramy także wieczorem i w weekend.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="tel:+48605071605" className={primaryBtn}>Zadzwoń: 605 071 605</a>
            <Link href="/nieruchomosci" className={secondaryBtn}>Zobacz nasze oferty</Link>
          </div>
          <nav aria-label="Gdzie działamy" className="mt-8 text-sm text-[var(--foreground-soft)]">
            <span>Działamy m.in. w okolicach: </span>
            {PLACE_LINKS.map((a, i) => (
              <span key={a.href}>
                {i > 0 && ', '}
                <Link href={a.href} prefetch={false} className="!text-[var(--gold-ink)] underline underline-offset-2">
                  {a.label}
                </Link>
              </span>
            ))}
            <span>.</span>
          </nav>
        </div>
      </section>
    </main>
  );
}
