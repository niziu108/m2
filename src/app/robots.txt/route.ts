// src/app/robots.txt/route.ts
import { SITE_URL as SITE } from '@/lib/site';

export async function GET() {
  const body =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /admin\n` +
    `Disallow: /api/\n` +
    `\n` +
    `Sitemap: ${SITE}/sitemap.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
