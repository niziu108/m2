// src/lib/place.ts
// Pobiera zbiorczą ocenę z Google (rating + liczba opinii) do danych strukturalnych.
// Mocny cache (24h) przez fetch revalidate, żeby nie generować kosztów API.
import 'server-only';

export type PlaceRating = { ratingValue: number; reviewCount: number };

const DAY = 86400;

async function tryV1(apiKey: string, placeId: string): Promise<PlaceRating | null> {
  const id = placeId.startsWith('places/') ? placeId : `places/${placeId}`;
  const url = `https://places.googleapis.com/v1/${id}?fields=rating,userRatingCount&languageCode=pl`;
  const res = await fetch(url, {
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'rating,userRatingCount' },
    next: { revalidate: DAY },
  });
  if (!res.ok) return null;
  const j: any = await res.json().catch(() => null);
  if (!j || typeof j.rating !== 'number' || !j.userRatingCount) return null;
  return { ratingValue: j.rating, reviewCount: j.userRatingCount };
}

async function tryLegacy(apiKey: string, placeId: string): Promise<PlaceRating | null> {
  const legacyId = placeId.replace(/^places\//, '');
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(legacyId)}&fields=rating,user_ratings_total&language=pl&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: DAY } });
  if (!res.ok) return null;
  const j: any = await res.json().catch(() => null);
  const r = j?.result;
  if (!r || typeof r.rating !== 'number' || !r.user_ratings_total) return null;
  return { ratingValue: r.rating, reviewCount: r.user_ratings_total };
}

/** Zwraca ocenę z Google lub null (bez rzucania błędem). */
export async function getPlaceRating(): Promise<PlaceRating | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.PLACE_ID;
  if (!apiKey || !placeId) return null;
  try {
    return (await tryV1(apiKey, placeId)) ?? (await tryLegacy(apiKey, placeId));
  } catch {
    return null;
  }
}
