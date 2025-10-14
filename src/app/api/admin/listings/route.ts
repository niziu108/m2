// src/app/api/admin/listings/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(s: string) {
  return (s || 'oferta')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      title,
      category,
      price,
      area,
      location,   // krótka etykieta
      lat,
      lng,
      listingNumber,
      isReserved,
      bullets,
      coverImageUrl,
      virtualTourUrl,
      contactPhone,
      contactEmail,
      shortDesc,
      body,
      images,     // string[]
      slug,       // opcjonalnie można przysłać
    } = data ?? {};

    if (!title || !category || typeof price === 'undefined' || !listingNumber) {
      return new NextResponse('Brak wymaganych pól (title, category, price, listingNumber).', { status: 400 });
    }

    // unikalny slug
    const base = slugify(slug || listingNumber || title);
    let finalSlug = base || 'oferta';
    let i = 0;
    while (true) {
      const exists = await prisma.listing.findUnique({ where: { slug: finalSlug } });
      if (!exists) break;
      i += 1;
      finalSlug = `${base}-${i}`;
    }

    const created = await prisma.listing.create({
      data: {
        title: String(title),
        slug: finalSlug,
        category,                           // 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE'
        price: Number(price) || 0,
        area: area == null ? null : Number(area),
        location: location ?? null,         // krótka etykieta
        lat: lat == null ? null : Number(lat),
        lng: lng == null ? null : Number(lng),
        listingNumber: String(listingNumber),
        isReserved: Boolean(isReserved),
        bullets: Array.isArray(bullets) ? bullets.filter(Boolean) : [],
        coverImageUrl: coverImageUrl ?? null,
        virtualTourUrl: virtualTourUrl ?? null,
        contactPhone: contactPhone ?? null,
        contactEmail: contactEmail ?? null,
        shortDesc: shortDesc ?? null,
        body: body ?? null,
        images: Array.isArray(images) && images.length
          ? { create: images.map((url: string, idx: number) => ({ url, order: idx })) }
          : undefined,
      },
      select: { id: true, slug: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/listings error:', err);
    const msg = typeof err?.message === 'string' ? err.message : 'Błąd zapisu';
    return new NextResponse(msg, { status: 400 });
  }
}
