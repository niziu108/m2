// src/app/api/auth/logout/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/adminAuth';

// Tylko POST: link w panelu jest pobierany z wyprzedzeniem, więc wylogowanie na GET działałoby samo.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
