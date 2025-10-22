export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { listingId } = await params; // ⬅️ WAŻNE: await!

  const url = new URL(req.url);
  const days = Number(url.searchParams.get('days') ?? '90');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [total, grouped] = await Promise.all([
    prisma.listingView.count({
      where: { listingId, createdAt: { gte: since } },
    }),
    prisma.listingView.groupBy({
      by: ['source'],
      where: { listingId, createdAt: { gte: since } },
      _count: { _all: true },
    }),
  ]);

  const bySource = Object.fromEntries(
    grouped.map((g) => [g.source, g._count._all])
  );

  return NextResponse.json({ listingId, since, total, bySource });
}