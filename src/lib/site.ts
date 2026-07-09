// src/lib/site.ts
// Jedno źródło prawdy dla kanonicznego adresu strony.
// Produkcja przekierowuje wersję bez "www" na "www", więc kanoniczna jest z "www".
// Normalizujemy niezależnie od tego, co jest w env, żeby nie było rozjazdu canonical/sitemap.

const RAW =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.m2.nieruchomosci.pl';

function normalize(url: string): string {
  let u = url.replace(/\/+$/, ''); // bez końcowego slasha
  // wymuś https
  u = u.replace(/^http:\/\//i, 'https://');
  // wymuś "www." dla domeny m2.nieruchomosci.pl
  u = u.replace(/^https:\/\/m2\.nieruchomosci\.pl/i, 'https://www.m2.nieruchomosci.pl');
  return u;
}

export const SITE_URL = normalize(RAW);

/** Zbuduj absolutny URL z ścieżki (np. "/domy" -> "https://www.m2.nieruchomosci.pl/domy"). */
export function abs(path = '/'): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${SITE_URL}${path === '/' ? '' : path}`;
}
