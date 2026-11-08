// src/lib/plotKinds.ts
// Rodzaje działek z własną stroną /dzialki/[rodzaj]. W bazie nie ma takiego pola,
// więc rodzaj czytamy z tytułu, cech i krótkiego opisu oferty.

import { normalizePl } from '@/lib/places';

type PlotInput = {
  category?: string | null;
  title: string;
  bullets?: string[] | null;
  shortDesc?: string | null;
};

export type PlotKind = {
  slug: string;
  name: string;
  title: string; // początek tytułu w Google
  heading: string;
  lead: string[];
  matches: (l: PlotInput) => boolean;
};

// „budowlana”, „budowlano-usługowa”, a w panelu zdarza się też literówka „budowalne”
const BUILDING = /budowl|budowaln/;
const BUILDING_PERMIT = /warunk[a-z]* zabudowy|mpzp|pozwoleni[a-z]* na budowe/;
const CONVERT = /przeksztalc/;
const FARM = /roln/;

function texts(l: PlotInput) {
  return {
    head: normalizePl(`${l.title} ${(l.bullets ?? []).join(' ')}`),
    desc: normalizePl(l.shortDesc ?? ''),
  };
}

function isBuilding(l: PlotInput) {
  if (l.category !== 'DZIALKA') return false;
  const { head, desc } = texts(l);
  if (CONVERT.test(head)) return false;
  if (BUILDING.test(head) || BUILDING_PERMIT.test(head)) return true;
  if (FARM.test(head)) return false;
  return BUILDING.test(desc) && !CONVERT.test(desc) && !FARM.test(desc);
}

function isFarm(l: PlotInput) {
  if (l.category !== 'DZIALKA') return false;
  const { head, desc } = texts(l);
  if (FARM.test(head) || CONVERT.test(head)) return true;
  if (BUILDING.test(head) || BUILDING_PERMIT.test(head)) return false;
  return FARM.test(desc);
}

export const PLOT_KINDS: PlotKind[] = [
  {
    slug: 'budowlane',
    name: 'Działki budowlane',
    title: 'Działki budowlane Bełchatów i okolice',
    heading: 'Działka pod Twój dom',
    lead: [
      'Działki budowlane na sprzedaż w Bełchatowie i okolicy do 40 km, w tym działki z decyzją o warunkach zabudowy. Przy każdej ofercie znajdziesz metraż, lokalizację i cenę za metr, a o to, czego nie widać w ogłoszeniu, możesz zapytać nas telefonicznie.',
      'Przed zakupem warto sprawdzić przeznaczenie działki w planie miejscowym albo warunki zabudowy, dojazd drogą publiczną oraz media: prąd, wodę i gaz. W razie pytań pomożemy to wyjaśnić, zanim podejmiesz decyzję.',
    ],
    matches: isBuilding,
  },
  {
    slug: 'rolne',
    name: 'Działki rolne',
    title: 'Działki rolne Bełchatów i okolice',
    heading: 'Ziemia i działki rolne',
    lead: [
      'Działki rolne na sprzedaż w Bełchatowie i okolicy, także z możliwością przekształcenia na budowlane. Ceny za metr są tu zwykle wyraźnie niższe niż przy działkach budowlanych.',
      'Kupując grunt rolny o powierzchni co najmniej 1 ha, warto wcześniej sprawdzić ograniczenia z ustawy o kształtowaniu ustroju rolnego. Jeśli działka ma w przyszłości służyć pod zabudowę, sprawdź też plan miejscowy w gminie. Pomożemy przejść przez te sprawy przed zakupem.',
    ],
    matches: isFarm,
  },
];

export function plotKindBySlug(slug: string): PlotKind | null {
  return PLOT_KINDS.find((k) => k.slug === slug) ?? null;
}
