export const runtime = 'nodejs';
export const revalidate = 600;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import LandingPage from '@/components/LandingPage';
import { cldOgImage } from '@/lib/img';
import { getAllListings, toCards } from '@/lib/listings';
import { minPrice } from '@/lib/offerStats';
import { MIN_OFFERS_TO_INDEX, indexablePlaces } from '@/lib/places';
import { PLOT_KINDS, plotKindBySlug } from '@/lib/plotKinds';
import { ofertyLabel, toPLN } from '@/lib/text';

type Props = { params: Promise<{ rodzaj: string }> };

export function generateStaticParams() {
  return [];
}

const loadKind = cache(async (slug: string) => {
  const kind = plotKindBySlug(slug);
  if (!kind) return null;
  const all = await getAllListings();
  return { kind, all, rows: all.filter(kind.matches) };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rodzaj } = await params;
  const data = await loadKind(rodzaj);
  if (!data) return { title: 'Nie znaleziono strony', robots: { index: false } };

  const { kind, rows } = data;
  const from = minPrice(rows);
  const title = rows.length
    ? `${kind.title}: ${ofertyLabel(rows.length)}${from ? ` od ${toPLN(from)}` : ''}`
    : kind.title;
  const description = `${kind.name} na sprzedaż w Bełchatowie i okolicy do 40 km${
    rows.length ? `: ${ofertyLabel(rows.length)}${from ? `, ceny od ${toPLN(from)}` : ''}` : ''
  }. Metraże, lokalizacje i ceny za m². Kupujący nie płaci prowizji. M2 Nieruchomości, tel. 605 071 605.`;
  const url = `/dzialki/${kind.slug}`;
  const cover = rows.find((r) => r.coverImageUrl)?.coverImageUrl;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: rows.length >= MIN_OFFERS_TO_INDEX ? undefined : { index: false, follow: true },
    openGraph: {
      url,
      title,
      description,
      type: 'website',
      siteName: 'M2 Nieruchomości',
      locale: 'pl_PL',
      images: [{ url: cldOgImage(cover) ?? '/og.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { rodzaj } = await params;
  const data = await loadKind(rodzaj);
  if (!data) notFound();

  const { kind, rows, all } = data;

  return (
    <LandingPage
      path={`/dzialki/${kind.slug}`}
      crumbs={[
        { name: 'Strona główna', href: '/' },
        { name: 'Działki', href: '/dzialki' },
        { name: kind.name },
      ]}
      phrase={kind.title}
      heading={kind.heading}
      lead={kind.lead}
      items={await toCards(rows)}
      searchNote="Nie widzisz działki dla siebie? Możemy szukać na bieżąco, wystarczy jeden telefon."
      sellNote="Sprzedajesz działkę? Wycenimy grunt i znajdziemy kupca. Wstępną wycenę robimy bezpłatnie."
      related={[
        ...PLOT_KINDS.filter((k) => k.slug !== kind.slug).map((k) => ({ label: k.name, href: `/dzialki/${k.slug}` })),
        { label: 'Wszystkie działki', href: '/dzialki' },
        ...indexablePlaces(all).map((p) => ({ label: p.name, href: `/nieruchomosci/${p.slug}` })),
      ]}
    />
  );
}
