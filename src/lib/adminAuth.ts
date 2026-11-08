// src/lib/adminAuth.ts
// Sesja panelu: podpisany token w ciasteczku HttpOnly, nigdy samo hasło.
// Tylko Web Crypto, bo ten plik działa i w middleware (Edge), i w route handlerach (Node).
import { NextResponse, type NextRequest } from 'next/server';

// Ta sama nazwa co dawne ciasteczko z hasłem: logowanie je nadpisuje, a jego stara treść nic już nie otwiera.
export const ADMIN_COOKIE = 'm2_admin';

const SESSION_SECONDS = 7 * 24 * 60 * 60; // 7 dni

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // Chrome i Firefox traktują localhost jak https, więc lokalnie też działa
  sameSite: 'lax',
  path: '/',
} as const;

const encoder = new TextEncoder();

function signingKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  );
}

function signedData(exp: string) {
  return encoder.encode(`m2-admin-session.${exp}`);
}

/** Token: <wygaśnięcie w sekundach>.<HMAC-SHA256 kluczem ADMIN_SECRET>. Zmiana ADMIN_SECRET unieważnia wszystkie sesje. */
async function createAdminToken(secret: string) {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const sig = await crypto.subtle.sign('HMAC', await signingKey(secret, 'sign'), signedData(exp));
  const hex = Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
  return `${exp}.${hex}`;
}

async function isValidAdminToken(token: string | undefined) {
  const secret = process.env.ADMIN_SECRET;
  // Brak ADMIN_SECRET na serwerze oznacza, że nikt nie wchodzi, a nie że wchodzą wszyscy.
  if (!secret || !token) return false;

  const match = /^(\d{1,12})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const [, exp, hex] = match;

  // crypto.subtle.verify porównuje podpis w stałym czasie.
  const sig = Uint8Array.from(hex.match(/../g)!, (h) => parseInt(h, 16));
  const valid = await crypto.subtle.verify('HMAC', await signingKey(secret, 'verify'), sig, signedData(exp));
  return valid && Number(exp) > Date.now() / 1000;
}

export function isAdminRequest(req: NextRequest) {
  return isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export function adminUnauthorized() {
  return NextResponse.json(
    { error: 'Brak logowania albo sesja wygasła. Zaloguj się ponownie.' },
    { status: 401, headers: { 'Cache-Control': 'no-store' } },
  );
}

/**
 * Pierwsza linia każdego handlera w /api/admin. Middleware sprawdza to samo wcześniej,
 * a ta kontrola zostaje na wypadek jego ominięcia albo zmiany matchera.
 */
export async function requireAdmin(req: NextRequest) {
  return (await isAdminRequest(req)) ? null : adminUnauthorized();
}

export async function setAdminCookie(res: NextResponse, secret: string) {
  res.cookies.set(ADMIN_COOKIE, await createAdminToken(secret), {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_SECONDS,
  });
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
}
