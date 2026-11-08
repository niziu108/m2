// src/lib/offerStats.ts
// Liczby liczone na żywo z aktualnych ofert: to one odróżniają strony miejscowości
// i wyceny od szablonowego tekstu.

import { plural, toPLN } from '@/lib/text';

type StatInput = {
  category?: string | null;
  price: number;
  area: number | null;
  isReserved?: boolean;
};

export function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Najniższa cena z ofert dostępnych; zarezerwowanych nie obiecujemy w nagłówku. */
export function minPrice(list: StatInput[]): number | null {
  const prices = list.filter((l) => !l.isReserved && l.price > 0).map((l) => l.price);
  const all = prices.length ? prices : list.filter((l) => l.price > 0).map((l) => l.price);
  return all.length ? Math.min(...all) : null;
}

export function medianPerM2(list: StatInput[]): number | null {
  const m = median(list.filter((l) => l.area && l.area > 0 && l.price > 0).map((l) => l.price / l.area!));
  return m == null ? null : Math.round(m);
}

const NAMES: Record<string, { head: string; count: (n: number) => string }> = {
  DZIALKA: { head: 'Działki', count: (n) => plural(n, 'działka', 'działki', 'działek') },
  DOM: { head: 'Domy', count: (n) => plural(n, 'dom', 'domy', 'domów') },
  MIESZKANIE: { head: 'Mieszkania', count: (n) => plural(n, 'mieszkanie', 'mieszkania', 'mieszkań') },
  INNE: { head: 'Inne nieruchomości', count: (n) => plural(n, 'inna nieruchomość', 'inne nieruchomości', 'innych nieruchomości') },
};

function byCategory(list: StatInput[]) {
  const counts = new Map<string, number>();
  for (const l of list) if (l.category) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function joinPl(parts: string[]) {
  if (parts.length < 2) return parts[0] ?? '';
  return `${parts.slice(0, -1).join(', ')} i ${parts[parts.length - 1]}`;
}

/** „Działki i domy”: rodzaje ofert w kolejności od najliczniejszych. */
export function typesPhrase(list: StatInput[]): string {
  const heads = byCategory(list)
    .filter(([c]) => c !== 'INNE')
    .map(([c]) => NAMES[c]?.head)
    .filter(Boolean) as string[];
  if (!heads.length) return 'Nieruchomości';
  const [first, ...rest] = heads;
  return joinPl([first, ...rest.map((h) => h.toLowerCase())]);
}

/** „3 działki i 2 domy” */
export function typesCount(list: StatInput[]): string {
  return joinPl(byCategory(list).map(([c, n]) => NAMES[c]?.count(n) ?? String(n)));
}

export type StatTile = { label: string; value: string };

const PER_M2_LABEL: Record<string, string> = {
  DZIALKA: 'Typowa cena działki',
  DOM: 'Typowa cena domu',
  MIESZKANIE: 'Typowa cena mieszkania',
};

/** Kafelki nad listą: liczba ofert, cena od i typowa cena za metr w każdej kategorii. */
export function statTiles(list: StatInput[]): StatTile[] {
  const tiles: StatTile[] = [{ label: 'Oferty', value: String(list.length) }];
  const from = minPrice(list);
  if (from != null) tiles.push({ label: 'Ceny od', value: toPLN(from) });
  for (const [category, label] of Object.entries(PER_M2_LABEL)) {
    const inCategory = list.filter((l) => l.category === category);
    if (inCategory.length < 2) continue;
    const perM2 = medianPerM2(inCategory);
    if (perM2 != null) tiles.push({ label, value: `${perM2.toLocaleString('pl-PL')} zł/m²` });
  }
  return tiles;
}
