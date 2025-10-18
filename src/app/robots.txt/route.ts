// src/app/robots.txt/route.ts
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.m2.nieruchomosci.pl';

export async function GET() {
  const body =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Sitemap: ${SITE}/sitemap.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}