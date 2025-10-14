// src/app/api/admin/listings/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** GET /api/admin/listings/:id */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const item = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

/** PATCH /api/admin/listings/:id
 *  🔒 Aktualizuje TYLKO pola przesłane w body.
 *  Dzięki temu toggle rezerwacji nie nadpisze tytułu, kategorii itd.
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  try {
    const d = await req.json()
    const data: any = {}

    const has = (k: string) => Object.prototype.hasOwnProperty.call(d, k)

    // tekstowe/liczbowe – ustawiamy tylko gdy przyszły w body
    if (has('title'))          data.title = (d.title ?? '').toString()
    if (has('category'))       data.category = d.category ?? null
    if (has('price'))          data.price = Number(d.price) || 0
    if (has('area'))           data.area = d.area == null ? null : Number(d.area)
    if (has('location'))       data.location = d.location ?? null
    if (has('lat'))            data.lat = d.lat == null ? null : Number(d.lat)
    if (has('lng'))            data.lng = d.lng == null ? null : Number(d.lng)
    if (has('isReserved'))     data.isReserved = Boolean(d.isReserved)
    if (has('bullets'))        data.bullets = Array.isArray(d.bullets) ? d.bullets.slice(0, 1) : []
    if (has('coverImageUrl'))  data.coverImageUrl = d.coverImageUrl ?? null
    if (has('virtualTourUrl')) data.virtualTourUrl = d.virtualTourUrl ?? null
    if (has('contactPhone'))   data.contactPhone = d.contactPhone ?? null
    if (has('contactEmail'))   data.contactEmail = d.contactEmail ?? null
    if (has('shortDesc'))      data.shortDesc = d.shortDesc ?? null
    if (has('body'))           data.body = d.body ?? null
    if (has('listingNumber')) {
      const ln = typeof d.listingNumber === 'string' ? d.listingNumber.trim() : ''
      data.listingNumber = ln.length ? ln : null
    }

    // obrazy aktualizujemy TYLKO jeśli body zawiera 'images'
    if (has('images')) {
      const images: string[] = Array.isArray(d.images) ? d.images : []
      data.images = {
        deleteMany: { listingId: id },
        create: images.map((url, order) => ({ url, order })),
      }
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    const msg = String(err?.message || '')
    // ładny komunikat kolizji numeru oferty
    if (msg.includes('Unique constraint') || msg.includes('P2002')) {
      return NextResponse.json(
        { error: 'Numer oferty już istnieje. Zmień „Numer oferty”.' },
        { status: 409 }
      )
    }
    console.error('PATCH /listings/[id] error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

/** (opcjonalnie) DELETE */
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  await prisma.image.deleteMany({ where: { listingId: id } })
  await prisma.listing.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
