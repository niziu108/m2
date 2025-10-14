// src/app/api/admin/reorder/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET -> krótkie dane do panelu reorder
export async function GET() {
  try {
    const rows = await prisma.listing.findMany({
      orderBy: [{ sortIndex: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        listingNumber: true,
        sortIndex: true,
        isReserved: true,
      },
    });
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to fetch list' },
      { status: 500 },
    );
  }
}

type Body = { orderedIds: string[] };

// POST -> zapisuje kolejność
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body || !Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { error: 'Body must include orderedIds: string[]' },
        { status: 400 },
      );
    }
    const ids = body.orderedIds.filter((x) => typeof x === 'string');
    if (ids.length === 0) {
      return NextResponse.json({ error: 'orderedIds is empty' }, { status: 400 });
    }

    await prisma.$transaction(
      ids.map((id, idx) =>
        prisma.listing.update({
          where: { id },
          data: { sortIndex: idx },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to reorder' },
      { status: 500 },
    );
  }
}