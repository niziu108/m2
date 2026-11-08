// src/lib/text.ts
// Porządkowanie tekstów z panelu (CAPS LOCK, znaczniki [[gold]]) i polska odmiana liczb.

export function plainText(s?: string | null) {
  return (s ?? '')
    .replace(/\[\[\/?[a-z]+\]\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function niceTitle(s: string) {
  const t = plainText(s).replace(/[.\s]+$/, '');
  // CAPS LOCK z panelu -> zdanie
  if (t && t === t.toUpperCase()) return t.charAt(0) + t.slice(1).toLowerCase();
  return t;
}

// „WOLA GŁUPICKA, GMINA DRUŻBICE” -> „Wola Głupicka, gmina Drużbice”
export function niceLocation(s?: string | null) {
  return plainText(s)
    .split(',')
    .map((part) => {
      let p = part.trim();
      if (p && p === p.toUpperCase() && /\p{L}/u.test(p)) {
        p = p.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_m, a, b) => a + b.toUpperCase());
      }
      return p.replace(/^(Gmina|Powiat|Ul\.|Os\.|Osiedle)\s/, (m) => m.toLowerCase());
    })
    .filter(Boolean)
    .join(', ');
}

export function toPLN(n: number) {
  return n.toLocaleString('pl-PL') + ' zł';
}

/** Odmiana po liczbie: 1 oferta, 2 oferty, 5 ofert, 12 ofert, 22 oferty. */
export function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return `1 ${one}`;
  const last = n % 10;
  const twoLast = n % 100;
  return `${n} ${last >= 2 && last <= 4 && !(twoLast >= 12 && twoLast <= 14) ? few : many}`;
}

export function ofertyLabel(n: number) {
  return plural(n, 'oferta', 'oferty', 'ofert');
}
