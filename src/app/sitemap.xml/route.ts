// src/app/sitemap.xml/route.ts
// Odświeżamy co godzinę, żeby nowe oferty trafiały do Google bez czekania na deploy.
export const runtime = 'nodejs';
export const revalidate = 3600;

import 'server-only';
import { cldOptimize } from '@/lib/img';
import { MIN_OFFERS_TO_INDEX, PLACES, placeOf } from '@/lib/places';
import { PLOT_KINDS } from '@/lib/plotKinds';
import { prisma } from '@/lib/prisma';
import { SITE_URL as SITE } from '@/lib/site';

const iso = (d: Date) => new Date(d).toISOString();

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: string[];
};

const newest = (rows: { updatedAt: Date }[]) =>
  rows.length ? iso(new Date(Math.max(...rows.map((r) => new Date(r.updatedAt).getTime())))) : undefined;

export async function GET() {
  // Strony statyczne
  const staticUrls: SitemapUrl[] = [
    { loc: `${SITE}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE}/nieruchomosci`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/domy`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/mieszkania`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/dzialki`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/inne`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE}/wycena-nieruchomosci`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE}/faq`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE}/polityka-prywatnosci`, changefreq: 'yearly', priority: '0.2' },
  ];

  // Oferty z bazy oraz strony miejscowości i rodzajów działek
  let dynamicUrls: SitemapUrl[] = [];

  try {
    const listings = await prisma.listing.findMany({
      select: {
        slug: true, updatedAt: true, coverImageUrl: true, location: true,
        title: true, bullets: true, shortDesc: true, category: true,
        images: { select: { url: true }, orderBy: { order: 'asc' }, take: 10 },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });

    const offers: SitemapUrl[] = listings.map((l) => ({
      loc: `${SITE}/oferta/${l.slug}`,
      lastmod: iso(l.updatedAt ?? new Date()),
      changefreq: 'weekly',
      priority: '0.8',
      // zdjęcia ofert w sitemapie: dodatkowa droga do klientów z Grafiki Google
      images: Array.from(
        new Set([l.coverImageUrl, ...l.images.map((i) => i.url)].filter(Boolean) as string[])
      ).slice(0, 10),
    }));

    // tylko strony z dość dużą liczbą ofert (reszta ma noindex i nie powinna tu trafiać)
    const places: SitemapUrl[] = PLACES.flatMap((place) => {
      const rows = listings.filter((l) => placeOf(l.location)?.slug === place.slug);
      if (rows.length < MIN_OFFERS_TO_INDEX) return [];
      return [{ loc: `${SITE}/nieruchomosci/${place.slug}`, lastmod: newest(rows), changefreq: 'weekly', priority: '0.8' }];
    });

    const kinds: SitemapUrl[] = PLOT_KINDS.flatMap((kind) => {
      const rows = listings.filter(kind.matches);
      if (rows.length < MIN_OFFERS_TO_INDEX) return [];
      return [{ loc: `${SITE}/dzialki/${kind.slug}`, lastmod: newest(rows), changefreq: 'weekly', priority: '0.8' }];
    });

    dynamicUrls = [...places, ...kinds, ...offers];
  } catch {
    // Bez bazy też działa — będzie tylko część statyczna
  }

  const urls = [...staticUrls, ...dynamicUrls];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    urls
      .map(
        (u) =>
          `<url>` +
          `<loc>${escapeXml(u.loc)}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
          `<changefreq>${u.changefreq}</changefreq>` +
          `<priority>${u.priority}</priority>` +
          (u.images ?? [])
            .map((src) => `<image:image><image:loc>${escapeXml(cldOptimize(src, 1400))}</image:loc></image:image>`)
            .join('') +
          `</url>`
      )
      .join('') +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
