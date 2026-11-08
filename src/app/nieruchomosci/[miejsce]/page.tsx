export const runtime = 'nodejs';
// Strona leży w pamięci i odświeża się co 10 minut: szybkie wejście, a nowe oferty pojawiają się same
export const revalidate = 600;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import LandingPage from '@/components/LandingPage';
import { cldOgImage } from '@/lib/img';
import { getAllListings, toCards } from '@/lib/listings';
import { minPrice, typesCount, typesPhrase } from '@/lib/offerStats';
import {
  MIN_OFFERS_TO_INDEX,
  indexablePlaces,
  nameInText,
  normalizePl,
  placeBySlug,
  placeOf,
  type Place,
} from '@/lib/places';
import { niceLocation, ofertyLabel, toPLN } from '@/lib/text';

type Props = { params: Promise<{ miejsce: string }> };

// Bez listy z góry: każda strona powstaje przy pierwszym wejściu, więc budowa nie zależy od bazy
export function generateStaticParams() {
  return [];
}

const loadPlace = cache(async (slug: string) => {
  const place = placeBySlug(slug);
  if (!place) return null;
  const all = await getAllListings();
  return { place, all, rows: all.filter((l) => placeOf(l.location)?.slug === place.slug) };
});

/** Miejscowości z lokalizacji ofert: „Dubie, Kuźnica Lubiecka”, bez gminy, ulicy i samego miasta. */
function villageNames(rows: { location: string | null }[], place: Place) {
  const own = normalizePl(place.name).replace(/^gmina /, '');
  const names = new Map<string, string>();
  for (const r of rows) {
    for (const raw of niceLocation(r.location).split(/[,()]/)) {
      const name = raw.trim();
      const key = normalizePl(name);
      if (!key || key === own || key === 'belchatow') continue;
      if (/^(gmina|gm|powiat|pow|ul|os|osiedle|pod)( |$)/.test(key) || /(^| )km( |$)|^\d/.test(key)) continue;
      names.set(key, name);
    }
  }
  return [...names.values()].slice(0, 12);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { miejsce } = await params;
  const data = await loadPlace(miejsce);
  if (!data) return { title: 'Nie znaleziono strony', robots: { index: false } };

  const { place, rows } = data;
  const from = minPrice(rows);
  const name = nameInText(place);
  const title = rows.length
    ? `${typesPhrase(rows)} na sprzedaż ${name}: ${ofertyLabel(rows.length)}${from ? ` od ${toPLN(from)}` : ''}`
    : `Nieruchomości na sprzedaż ${name}`;
  const description = rows.length
    ? `${typesCount(rows)} na sprzedaż ${place.inName} i okolicy${from ? `, ceny od ${toPLN(from)}` : ''}. Zdjęcia, metraże i ceny za m². Kupujący nie płaci prowizji. M2 Nieruchomości, tel. 605 071 605.`
    : `Nieruchomości ${place.inName} i okolicy. M2 Nieruchomości z Bełchatowa, tel. 605 071 605.`;
  const url = `/nieruchomosci/${place.slug}`;
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
  const { miejsce } = await params;
  const data = await loadPlace(miejsce);
  if (!data) notFound();

  const { place, rows, all } = data;
  const from = minPrice(rows);
  const villages = villageNames(rows, place);

  const offerLine = rows.length
    ? `W naszej ofercie ${place.inName}: ${typesCount(rows)}${from ? `, ceny od ${toPLN(from)}` : ''}.` +
      (villages.length ? ` Miejscowości: ${villages.join(', ')}.` : '')
    : `W tej chwili nie mamy ofert ${place.inName}. Nowe nieruchomości pojawiają się tu automatycznie, gdy tylko trafią do naszej oferty.`;

  const others = indexablePlaces(all).filter((p) => p.slug !== place.slug);

  return (
    <LandingPage
      path={`/nieruchomosci/${place.slug}`}
      crumbs={[
        { name: 'Strona główna', href: '/' },
        { name: 'Oferty', href: '/nieruchomosci' },
        { name: place.name },
      ]}
      phrase={rows.length ? `${typesPhrase(rows)} na sprzedaż` : 'Nieruchomości na sprzedaż'}
      heading={place.heading}
      lead={[place.about, offerLine]}
      items={await toCards(rows)}
      searchNote={`Możemy szukać dla Ciebie ${place.inName} i w okolicy na bieżąco, wystarczy jeden telefon. Każdą nieruchomość oglądaliśmy osobiście, pokazujemy ją także wieczorem i w weekend, a kupujący nie płaci u nas prowizji.`}
      sellNote={`Sprzedajemy nieruchomości ${place.inName} i w całej okolicy Bełchatowa, w promieniu do 40 km. Wstępną wycenę robimy bezpłatnie.`}
      related={[
        ...others.map((p) => ({ label: p.name, href: `/nieruchomosci/${p.slug}` })),
        { label: 'Działki budowlane', href: '/dzialki/budowlane' },
        { label: 'Domy', href: '/domy' },
        { label: 'Mieszkania', href: '/mieszkania' },
        { label: 'Wszystkie oferty', href: '/nieruchomosci' },
      ]}
    />
  );
}
