// src/app/sitemap.xml/route.ts
import 'server-only';
import { prisma } from '@/lib/prisma';
import { SITE_URL as SITE } from '@/lib/site';

const iso = (d: Date) => new Date(d).toISOString();

export async function GET() {
  // Strony statyczne
  const staticUrls = [
    { loc: `${SITE}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE}/domy`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/mieszkania`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/dzialki`, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/inne`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE}/faq`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE}/polityka-prywatnosci`, changefreq: 'yearly', priority: '0.2' },
  ];

  // Oferty z bazy
  let dynamicUrls:
    { loc: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];

  try {
    const listings = await prisma.listing.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });

    dynamicUrls = listings.map((l) => ({
      loc: `${SITE}/oferta/${l.slug}`,
      lastmod: iso(l.updatedAt ?? new Date()),
      changefreq: 'weekly',
      priority: '0.8',
    }));
  } catch {
    // Bez bazy też działa — będzie tylko część statyczna
  }

  const urls = [...staticUrls, ...dynamicUrls];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
      .map(
        (u) =>
          `<url>` +
          `<loc>${u.loc}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
          `<changefreq>${u.changefreq}</changefreq>` +
          `<priority>${u.priority}</priority>` +
          `</url>`
      )
      .join('') +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
