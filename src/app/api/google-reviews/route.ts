export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// UWAGA: tutaj musi być STAŁA liczba (bez 60*60 itp. – Vercel wtedy marudzi)
export const revalidate = 86400; // 24h

import { NextResponse } from 'next/server';

type LegacyReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  time?: number;
};

type V1Review = {
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  rating?: number;
  text?: { text?: string };
  publishTime?: string;
};

function toPL(dateMs: number) {
  return new Date(dateMs).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' });
}

/* ====== ISO tydzień + deterministyczny shuffle ====== */
function getISOWeekInPoland(d: Date) {
  const zonedStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
  const zoned = new Date(zonedStr);
  const day = (zoned.getDay() + 6) % 7; // 0=pon
  zoned.setDate(zoned.getDate() - day + 3);
  const thursday = new Date(zoned);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const dayOfYear = Math.floor((thursday.getTime() - firstThursday.getTime()) / 86400000) + 1;
  const week = 1 + Math.floor((dayOfYear - 1) / 7);
  const year = thursday.getFullYear();
  return { year, week };
}
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========== FETCH: Places v1 / legacy ========== */
async function fetchV1(apiKey: string, placeId: string) {
  const id = placeId.startsWith('places/') ? placeId : `places/${placeId}`;
  const url = `https://places.googleapis.com/v1/${id}?fields=googleMapsUri,rating,userRatingCount,reviews&languageCode=pl`;

  const res = await fetch(url, {
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': '*' },
    next: { revalidate },
  });

  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok || !json) throw new Error(`V1_FAIL status=${res.status} body=${text}`);

  const googleUri: string | undefined = json?.googleMapsUri;
  const raw: V1Review[] = json?.reviews ?? [];
  return {
    reviews: raw.map(r => ({
      authorName: r.authorAttribution?.displayName ?? 'Użytkownik Google',
      authorPhoto: r.authorAttribution?.photoUri,
      rating: r.rating ?? 5,
      text: r.text?.text ?? '',
      time: r.publishTime ? toPL(new Date(r.publishTime).getTime()) : '',
      url: googleUri,
    })),
    source: 'v1' as const,
  };
}
async function fetchLegacy(apiKey: string, placeId: string) {
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=url,reviews,rating,user_ratings_total` +
    `&language=pl&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate } });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok || !json || (json.status && json.status !== 'OK')) {
    throw new Error(`LEGACY_FAIL status=${res.status} body=${text}`);
  }

  const uri = json?.result?.url as string | undefined;
  const raw = (json?.result?.reviews ?? []) as LegacyReview[];
  return {
    reviews: raw.map(r => ({
      authorName: r.author_name ?? 'Użytkownik Google',
      authorPhoto: r.profile_photo_url,
      rating: r.rating ?? 5,
      text: r.text ?? '',
      time: r.time ? toPL(r.time * 1000) : '',
      url: uri,
    })),
    source: 'legacy' as const,
  };
}

/* ======== In-memory cache po stronie serwera (10 min) ======== */
type CacheEntry = { ts: number; body: any; };
let MEM_CACHE: CacheEntry | null = null;
const MEM_TTL_MS = 10 * 60 * 1000;

/* ======== Handler z tygodniową rotacją + throttling ======== */
const WEEKLY_PICK = Number(process.env.REVIEWS_WEEKLY_COUNT ?? 12);

export async function GET() {
  try {
    const now = Date.now();
    if (MEM_CACHE && now - MEM_CACHE.ts < MEM_TTL_MS) {
      return NextResponse.json(MEM_CACHE.body, {
        headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' },
      });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.PLACE_ID;
    if (!apiKey || !placeId) {
      const body = { reviews: [], source: null, error: 'Brak GOOGLE_PLACES_API_KEY lub PLACE_ID w .env' };
      MEM_CACHE = { ts: now, body };
      return NextResponse.json(body, { status: 500 });
    }

    let reviews: Array<{
      authorName: string; authorPhoto?: string; rating: number; text: string; time: string; url?: string;
    }> = [];
    let source: 'v1' | 'legacy' | null = null;
    let warn: string | undefined;

    try {
      const v1 = await fetchV1(apiKey, placeId);
      reviews = v1.reviews;
      source = v1.source;
      if (!reviews.length) throw new Error('v1 returned 0 reviews');
    } catch (eV1: unknown) {
      warn = String((eV1 as Error)?.message || eV1);
      const legacy = await fetchLegacy(apiKey, placeId);
      reviews = legacy.reviews;
      source = legacy.source;
    }

    const { year, week } = getISOWeekInPoland(new Date());
    const seed = (year * 1000 + week) ^ (reviews.length * 2654435761);
    const picked = shuffleSeeded(reviews, seed).slice(0, Math.min(WEEKLY_PICK, reviews.length));

    const body = { reviews: picked, source, week: { year, week }, warn };
    MEM_CACHE = { ts: now, body };

    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' },
    });
  } catch (e: unknown) {
    const body = { reviews: [], source: null, error: String((e as Error)?.message || e) };
    MEM_CACHE = { ts: Date.now(), body };
    return NextResponse.json(body, { status: 500 });
  }
}