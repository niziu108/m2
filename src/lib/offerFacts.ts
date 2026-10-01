// src/lib/offerFacts.ts
// Fakty o ofercie wyciągane z opisu z panelu: dokładny metraż, pokoje, piętro, loggia/piwnica itd.
// Ludzie szukają długimi frazami („3 pokoje 63,61 m² loggia I piętro os. Czaplinieckie”),
// a w bazie mamy tylko area (często zaokrąglone) i hasło jako tytuł. Nie ruszamy danych,
// tylko czytamy opis i pokazujemy te fakty w tytule, H1, tabeli i schemacie.

export type OfferFacts = {
  area: number | null; // metraż z opisu z dokładnością do setnych (gdy pasuje do pola area)
  rooms: number | null;
  floor: number | null; // 0 = parter
  extras: string[]; // „loggia”, „piwnica”…
};

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };
const ORDINAL: Record<string, number> = {
  pierwsz: 1, drugi: 2, trzeci: 3, czwart: 4, piąt: 5, szóst: 6, siódm: 7, ósm: 8, dziewiąt: 9, dziesiąt: 10,
};
const WORD_NUM: Record<string, number> = {
  jedno: 1, dwu: 2, dwój: 2, trzy: 3, cztero: 4, pięcio: 5, sześcio: 6,
};

function plain(s?: string | null) {
  return (s ?? '').replace(/\[\[\/?[a-z]+\]\]/g, '').replace(/\s+/g, ' ').trim();
}

function preciseArea(desc: string, area: number | null): number | null {
  if (!area) return null;
  for (const m of desc.matchAll(/(\d{1,5}(?:[,.]\d{1,2})?)\s*(?:m²|m2|mkw|m\.? ?kw)/gi)) {
    const v = parseFloat(m[1].replace(',', '.'));
    // tylko gdy to ten sam metraż co w panelu (63 → 63,61), żeby nie złapać metrażu pokoju
    if (Math.abs(v - area) < 1) return v;
  }
  return area;
}

function rooms(bullets: string[], desc: string): number | null {
  for (const b of bullets) {
    const m = b.match(/^\s*(\d{1,2})\s*(pok|$)/i);
    if (m) return parseInt(m[1], 10);
  }
  const d = desc.match(/(\d{1,2})\s*-?\s*pokojow|(\d{1,2})\s+pok(?:oje|oi|ój)\b/i);
  if (d) return parseInt(d[1] ?? d[2], 10);
  const w = desc.match(/(?<!\p{L})(jedno|dwu|dwój|trzy|cztero|pięcio|sześcio)\s*-?\s*pokojow/iu);
  if (w) return WORD_NUM[w[1].toLowerCase()] ?? null;
  return null;
}

function floor(desc: string): number | null {
  if (/(?<!\p{L})na parterze(?!\p{L})/iu.test(desc)) return 0;
  const m = desc.match(/(?<!\p{L})na\s+(\S+)\s+piętrze/iu);
  if (!m) return null;
  const w = m[1].replace(/[.,]/g, '');
  if (/^\d{1,2}$/.test(w)) return parseInt(w, 10);
  if (ROMAN[w]) return ROMAN[w];
  const key = Object.keys(ORDINAL).find((k) => w.toLowerCase().startsWith(k));
  return key ? ORDINAL[key] : null;
}

// Kolejność = kolejność w tytule (najmocniejsze wyróżniki pierwsze)
// \b w JS nie zna polskich liter („balkon|ów” to dla niego granica słowa), stąd \p{L} z flagą u
const EXTRAS: [string, RegExp][] = [
  ['loggia', /(?<!\p{L})logg?i[aię]/iu],
  // tylko liczba pojedyncza: „remont balkonów”, „balkony odnowione” to budynek, nie ten lokal;
  // „balkon typu loggia” to loggia
  ['balkon', /(?<!\p{L})balkon(?:em|u)?(?!\p{L})(?! typu logg)/iu],
  ['taras', /(?<!\p{L})taras(?:em|u)?(?!\p{L})/iu],
  ['ogródek', /(?<!\p{L})ogród(?:ek|kiem)?(?!\p{L})/iu],
  ['piwnica', /(?<!\p{L})piwnic/iu],
  ['komórka lokatorska', /(?<!\p{L})komórk\p{L}* lokatorsk/iu],
  ['garaż', /(?<!\p{L})garaż/iu],
  ['miejsce postojowe', /(?<!\p{L})miejsc\p{L}* postojow/iu],
  ['winda', /(?<!\p{L})wind(?:a|ą|y|ę)(?!\p{L})/iu],
];

export function offerFacts(l: {
  category: string;
  area: number | null;
  bullets?: string[] | null;
  shortDesc?: string | null;
  body?: string | null;
}): OfferFacts {
  const desc = plain(`${l.shortDesc ?? ''} ${l.body ?? ''}`);
  const housing = l.category === 'MIESZKANIE' || l.category === 'DOM';
  return {
    area: preciseArea(desc, l.area),
    rooms: housing ? rooms(l.bullets ?? [], desc) : null,
    // piętro ma sens tylko w mieszkaniu (w domach „parter/piętro” to kondygnacje)
    floor: l.category === 'MIESZKANIE' ? floor(desc) : null,
    extras: housing ? EXTRAS.filter(([, re]) => re.test(desc)).map(([name]) => name) : [],
  };
}

export function floorLabel(f: number | null): string | null {
  if (f == null) return null;
  if (f === 0) return 'parter';
  const roman = Object.keys(ROMAN).find((k) => ROMAN[k] === f);
  return `${roman ?? f} piętro`;
}

export function roomsLabel(n: number | null): string | null {
  if (!n) return null;
  if (n === 1) return '1 pokój';
  const last = n % 10;
  const teen = n % 100 >= 12 && n % 100 <= 14;
  return `${n} ${last >= 2 && last <= 4 && !teen ? 'pokoje' : 'pokoi'}`;
}

export function areaLabel(a: number | null): string | null {
  return a ? `${a.toLocaleString('pl-PL', { maximumFractionDigits: 2 })} m²` : null;
}
