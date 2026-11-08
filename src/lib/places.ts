// src/lib/places.ts
// Gminy wokół Bełchatowa z własną stroną /nieruchomosci/[slug].
// Portale zbierają ruch na frazach typu „działki Drużbice”, a nasze oferty stały tylko na
// wspólnej liście. Lokalizacja w panelu to wolny tekst, więc ofertę przypisujemy po nazwach
// miejscowości: nowa oferta sama trafia na właściwą stronę, nic nie trzeba ustawiać.
// Listy miejscowości: sołectwa gmin z polskiej Wikipedii, bez nazw powtarzających się
// w kilku gminach (Janów, Adamów, Borowa…), bo samej takiej nazwy nie da się przypisać.

export type Place = {
  slug: string;
  name: string; // „Szczerców”
  inName: string; // „w Szczercowie”
  heading: string; // duży nagłówek strony
  about: string; // kilka zdań z faktami o miejscu
  stems: string[]; // początki słów: łapią też „pod Szczercowem”
  villages: string[]; // pełne nazwy miejscowości
};

export const PLACES: Place[] = [
  {
    slug: 'szczercow',
    name: 'Szczerców',
    inName: 'w gminie Szczerców',
    heading: 'Szczerców i okolice',
    about:
      'Szczerców to wieś nad Widawką i siedziba gminy w powiecie bełchatowskim, około 17 km na zachód od Bełchatowa.',
    stems: ['szczerc'],
    villages: [
      'Chabielice', 'Dubie', 'Grudna', 'Janówka', 'Kieruzele', 'Kuźnica Lubiecka', 'Lubiec',
      'Magdalenów', 'Niwy', 'Osiny', 'Podklucze', 'Podżar', 'Polowa', 'Rudzisko', 'Stanisławów',
      'Tatar', 'Zbyszek', 'Dzbanki', 'Firlej', 'Załuże', 'Lubośnia',
    ],
  },
  {
    slug: 'zelow',
    name: 'Zelów',
    inName: 'w gminie Zelów',
    heading: 'Zelów i okolice',
    about:
      'Zelów to miasto w powiecie bełchatowskim, około 14 km na północny zachód od Bełchatowa, i siedziba gminy miejsko-wiejskiej obejmującej 35 sołectw.',
    stems: ['zelow'],
    villages: [
      'Bocianicha', 'Bujny Księże', 'Bujny Szlacheckie', 'Chajczyny', 'Grabostów', 'Grębociny',
      'Ignaców', 'Jamborek', 'Jawor', 'Karczmy', 'Kociszew', 'Kurówek', 'Łęki', 'Łobudzice',
      'Mauryców', 'Ostoja', 'Pawłowa', 'Pożdżenice', 'Pszczółki', 'Pukawica', 'Sobki', 'Sromutka',
      'Walewice', 'Wola Pszczółecka', 'Wygiełzów', 'Wypychów', 'Zabłoty', 'Zagłówki',
    ],
  },
  {
    slug: 'druzbice',
    name: 'Drużbice',
    inName: 'w gminie Drużbice',
    heading: 'Drużbice i okolice',
    about:
      'Drużbice leżą nad Grabią, około 11 km na północ od Bełchatowa. To siedziba gminy wiejskiej w powiecie bełchatowskim.',
    stems: ['druzbic'],
    villages: [
      'Bukowie Dolne', 'Bukowie Górne', 'Chynów', 'Głupice', 'Wola Głupicka', 'Gręboszów', 'Hucisko',
      'Kazimierzów', 'Kącik', 'Kobyłki', 'Łęczyca', 'Patok', 'Podstoła', 'Rasy', 'Rawicz',
      'Rożniatowice', 'Skrajne', 'Stefanów', 'Stoki', 'Suchcice', 'Teresin', 'Wadlew', 'Wdowin',
      'Wola Rożniatowska', 'Zabiełłów', 'Zwierzyniec',
    ],
  },
  {
    slug: 'kleszczow',
    name: 'Kleszczów',
    inName: 'w gminie Kleszczów',
    heading: 'Kleszczów i okolice',
    about:
      'Kleszczów leży około 17 km na południe od Bełchatowa. Gmina należy do najbogatszych w Polsce dzięki Kopalni Węgla Brunatnego „Bełchatów” i Elektrowni Bełchatów.',
    stems: ['kleszczow'],
    villages: ['Antoniówka', 'Czyżów', 'Łękińsko', 'Łuszczanowice', 'Rogowiec', 'Żłobnica', 'Będków', 'Bogumiłów'],
  },
  {
    slug: 'kluki',
    name: 'Kluki',
    inName: 'w gminie Kluki',
    heading: 'Kluki i okolice',
    about:
      'Kluki leżą przy drodze krajowej nr 74, około 9 km na zachód od Bełchatowa. To siedziba gminy wiejskiej w powiecie bełchatowskim.',
    stems: [],
    villages: [
      'Kluki', 'Klukach', 'Imielnia', 'Kaszewice', 'Kuźnica Kaszewska', 'Nowy Janów', 'Osina', 'Parzno',
      'Podwódka', 'Roździn', 'Strzyżewice', 'Ścichawa', 'Trząs', 'Wierzchy Kluckie', 'Żelichów',
      'Bożydar', 'Chmielowiec', 'Kawalce', 'Podścichawa',
    ],
  },
  {
    slug: 'rusiec',
    name: 'Rusiec',
    inName: 'w gminie Rusiec',
    heading: 'Rusiec i okolice',
    about: 'Rusiec to siedziba gminy wiejskiej w powiecie bełchatowskim, około 26 km na zachód od Bełchatowa.',
    stems: [],
    villages: [
      'Rusiec', 'Ruścu', 'Annolesie', 'Dąbrowa Rusiecka', 'Dęby Wolskie', 'Jastrzębice', 'Korablew',
      'Mierzynów', 'Prądzew', 'Wincentów', 'Wola Wiązowa', 'Zakurowie', 'Zalasy', 'Krasowa',
    ],
  },
  {
    slug: 'wola-krzysztoporska',
    name: 'Wola Krzysztoporska',
    inName: 'w gminie Wola Krzysztoporska',
    heading: 'Wola Krzysztoporska i okolice',
    about:
      'Wola Krzysztoporska to siedziba gminy w powiecie piotrkowskim, około 16 km na wschód od Bełchatowa, w stronę Piotrkowa Trybunalskiego.',
    stems: [],
    villages: [
      'Wola Krzysztoporska', 'Bogdanów', 'Blizin', 'Gąski', 'Gomulin', 'Jeżów', 'Kacprów', 'Kozierogi',
      'Krężna', 'Krzyżanów', 'Majków Duży', 'Mąkolice', 'Miłaków', 'Moników', 'Mzurki', 'Budków',
      'Oprzężów', 'Parzniewice', 'Parzniewiczki', 'Pawłów Dolny', 'Pawłów Górny', 'Piekarki', 'Piekary',
      'Radziątków', 'Rokszyce', 'Siomki', 'Stradzew', 'Wola Rokszycka',
    ],
  },
  {
    slug: 'kamiensk',
    name: 'Kamieńsk',
    inName: 'w Kamieńsku',
    heading: 'Kamieńsk i okolice',
    about:
      'Kamieńsk to miasto w powiecie radomszczańskim, około 21 km na południowy wschód od Bełchatowa. Przez miasto biegną autostrada A1 i linia kolejowa z Górnego Śląska do Warszawy.',
    stems: [],
    villages: ['Kamieńsk', 'Kamieńsku'],
  },
  // Na końcu: sama nazwa „Bełchatów” w lokalizacji to miasto, a to strona o wsiach dookoła.
  {
    slug: 'gmina-belchatow',
    name: 'Gmina Bełchatów',
    inName: 'w gminie Bełchatów',
    heading: 'Gmina Bełchatów',
    about:
      'Gmina Bełchatów to kilkadziesiąt miejscowości otaczających miasto, m.in. Zdzieszulice, Bukowa, Oleśnik i Wólka Łękawska. Do centrum Bełchatowa jest stąd zwykle kilka lub kilkanaście kilometrów, dlatego to naturalny kierunek dla osób, które chcą mieszkać poza miastem, ale pracować i załatwiać sprawy na miejscu.',
    stems: [],
    villages: [
      'gmina Bełchatów', 'gm Bełchatów', 'Augustynów', 'Bugaj', 'Bukowa', 'Dobiecin', 'Dobrzelów', 'Domiechowice',
      'Janina', 'Kałduny', 'Kielchinów', 'Korczew', 'Księży Młyn', 'Kurnos', 'Ławy', 'Łękawa', 'Mokracz', 'Myszaki',
      'Niedyszyna', 'Oleśnik', 'Podwody', 'Poręby', 'Postękalice', 'Rząsawa', 'Słok', 'Wielopole', 'Wola Kruszyńska',
      'Wola Mikorska', 'Wólka Łękawska', 'Zalesna', 'Zawadów', 'Zawady', 'Zdzieszulice', 'Zwierzchów',
    ],
  },
];

/** Bez polskich znaków i interpunkcji: „ZDZIESZULICE GÓRNE (BEŁCHATÓW)” -> „zdzieszulice gorne belchatow”. */
export function normalizePl(s: string) {
  return s
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MATCHERS = PLACES.map((place) => {
  const parts = [
    ...place.stems.map((s) => `${escapeRe(normalizePl(s))}[a-z]*`),
    ...place.villages.map((v) => escapeRe(normalizePl(v))),
  ];
  return { place, re: new RegExp(`(?:^| )(?:${parts.join('|')})(?: |$)`) };
});

/** Gmina oferty albo null, gdy miejsca nie umiemy przypisać (oferta zostaje na zwykłych listach). */
export function placeOf(location?: string | null): Place | null {
  if (!location) return null;
  // ulica mówi o adresie, nie o gminie: „Bełchatów, ul. Szczercowska” to nie Szczerców
  const noStreet = location.replace(/(^|[\s,])ul\.?\s+[^,]*/gi, ' ');
  const text = normalizePl(noStreet);
  return MATCHERS.find((m) => m.re.test(text))?.place ?? null;
}

export function placeBySlug(slug: string): Place | null {
  return PLACES.find((p) => p.slug === slug) ?? null;
}

/** Poniżej tylu ofert strona działa, ale nie prosi Google o indeksowanie (za mało treści). */
export const MIN_OFFERS_TO_INDEX = 2;

export function placeCounts(rows: { location?: string | null }[]) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const p = placeOf(r.location);
    if (p) counts.set(p.slug, (counts.get(p.slug) ?? 0) + 1);
  }
  return counts;
}

/** Miejsca z wystarczającą liczbą ofert: tylko do nich linkujemy z list i sitemapy. */
export function indexablePlaces(rows: { location?: string | null }[]) {
  const counts = placeCounts(rows);
  return PLACES.filter((p) => (counts.get(p.slug) ?? 0) >= MIN_OFFERS_TO_INDEX);
}

/** „Szczerców” / „gmina Bełchatów”: nazwa do środka zdania i tytułu. */
export function nameInText(place: Place) {
  return place.name.replace(/^Gmina /, 'gmina ');
}
