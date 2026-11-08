// src/app/api/auth/login/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/adminAuth';

// Skróty mają stałą długość, więc porównanie w stałym czasie nie zdradza też długości hasła.
function samePassword(given: string, secret: string) {
  const sha256 = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(sha256(given), sha256(secret));
}

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Logowanie nie jest skonfigurowane.' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;
  if (typeof password !== 'string' || !samePassword(password, secret)) {
    return NextResponse.json({ error: 'Nieprawidłowe hasło.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  await setAdminCookie(res, secret);
  return res;
}
