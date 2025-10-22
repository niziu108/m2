// src/app/admin/page.tsx
export const runtime = 'nodejs'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ActionButtons from './ActionButtons'
import OfferStats from './OfferStats' // ⬅️ DODANE

type AdminProps = {
  // Next 15 -> Promise
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function Admin({ searchParams }: AdminProps) {
  const sp = await searchParams
  const q = sp?.q?.trim() || ''

  // filtr po numerze oferty
  const where: any = {}
  if (q) where.listingNumber = { contains: q }

  const items = await prisma.listing.findMany({
    where,
    // sort: najpierw ręczna kolejność, potem najnowsze
    orderBy: [{ sortIndex: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      category: true,
      listingNumber: true,
      area: true,
      price: true,
      isReserved: true,
    },
  })

  return (
    <main className="p-6 bg-[#131313] text-[#d9d9d9] min-h-[100svh]">
      <header className="flex flex-col items-center gap-5 mb-10">
        <h1 className="font-[Bungee] text-3xl text-[#E9C87D] tracking-[1px] text-center">
          PANEL OFERT
        </h1>

        {/* 🔍 WYSZUKIWARKA */}
        <form method="GET" className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Numer oferty…"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 w-[240px] text-center"
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#E9C87D] text-black font-medium">
              Szukaj
            </button>
            {q && (
              <Link href="/admin" className="px-4 py-2.5 rounded-xl border border-white/10">
                Wyczyść
              </Link>
            )}
          </div>
        </form>

        {/* 🟡 PRZYCISKI AKCJI */}
        <div className="flex gap-3 justify-center mt-4">
          <Link href="/admin/new" className="px-6 py-3 rounded-xl bg-[#E9C87D] text-black font-medium">
            + Nowa
          </Link>
          <Link href="/admin/reorder" className="px-6 py-3 rounded-xl border border-white/10 hover:bg:white/10 transition">
            Ułóż kolejność
          </Link>
          <Link href="/admin/logout" className="px-6 py-3 rounded-xl border border-white/10 hover:bg:white/10 transition">
            Wyloguj
          </Link>
        </div>
      </header>

      {/* 🏠 LISTA OFERT */}
      {items.length === 0 ? (
        <p className="opacity-80 text-center text-lg mt-10">
          {q ? 'Brak ofert dla podanego numeru.' : 'Brak ofert. Kliknij „+ Nowa”.'}
        </p>
      ) : (
        <ul className="grid md:grid-cols-3 gap-6">
          {items.map((i) => (
            <li key={i.id} className="rounded-2xl border border-white/10 p-4 bg:black/30">
              <div className="text-sm opacity-70 mb-1">
                {i.category}
                {i.isReserved ? ' • REZERWACJA' : ''}
              </div>

              <div className="text-lg font-medium text-[#E9C87D] mb-1">{i.title}</div>

              <div className="text-sm opacity-70 mb-3">
                #{i.listingNumber} • {i.area ?? '-'} m² • {i.price.toLocaleString('pl-PL')} zł
              </div>

              {/* ⬇⬇⬇ DODANE: mini statystyki odsłon */}
              <OfferStats listingId={i.id} />

              <ActionButtons id={i.id} isReserved={i.isReserved} />

              <div className="mt-3">
                <Link
                  href={`/admin/edit/${i.id}`}
                  className="block text-center px-3 py-2 rounded-lg bg:white/10 hover:bg:white/20 transition"
                >
                  ✏️ Edytuj
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
