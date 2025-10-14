// server route: /api/geocode?q=Belchatow
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });

  // Nominatim (OSM)
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'm2.nieruchomosci.pl (geocode)' },
    cache: 'no-store',
  });
  if (!r.ok) {
    return NextResponse.json({ error: 'Geocoder error' }, { status: 500 });
  }
  const arr = await r.json();
  if (!Array.isArray(arr) || !arr[0]) {
    return NextResponse.json({ found: false });
  }
  const { lat, lon } = arr[0];
  return NextResponse.json({ found: true, lat: parseFloat(lat), lng: parseFloat(lon) });
}
