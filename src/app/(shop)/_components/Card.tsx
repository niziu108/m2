import Link from 'next/link'

export function toPLN(n: number) {
  return n.toLocaleString('pl-PL') + ' zł'
}

export default function Card({ l }: { l: any }) {
  const bullet1 = (l.bullets || []).filter(Boolean)[0] || ''

  const infoRight: string[] = [
    l.area ? `${l.area} m²` : '',
    l.location || '',
    bullet1,
    l.listingNumber ? `NUMER OFERTY: ${l.listingNumber}` : '',
  ].filter(Boolean)

  return (
    <Link
      href={`/oferta/${l.slug}`}
      className="group block relative aspect-square rounded-2xl overflow-hidden border border-white/10 isolate bg-[#0f0f0f]"
    >
      {/* TŁO */}
      {l.coverImageUrl ? (
        <img
          src={l.coverImageUrl}
          alt={l.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            l.isReserved ? 'opacity-70' : ''
          }`}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-black/40 text-sm">
          brak zdjęcia
        </div>
      )}

      {/* PRZYCIEMNIENIE PODSTAWOWE */}
      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/30 transition-colors" />

      {/* TYTUŁ + LOGO */}
      <div className="absolute inset-x-0 top-4 text-center px-4 flex flex-col items-center">
        <h3 className="font-[Bungee] text-[#E9C87D] text-[clamp(18px,3.8vw,36px)] leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] mb-2">
          {String(l.title || '').toUpperCase()}
        </h3>
        <img
          src="/logo.webp"
          alt="Logo"
          className="w-[80px] opacity-85 drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* DÓŁ KARTY */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75 to-transparent">
        <div className="w-full flex items-end justify-between gap-3">
          <div className="font-[Bungee] text-[#E9C87D] text-[clamp(18px,2.8vw,26px)]">
            {toPLN(l.price)}
          </div>

          <div className="min-w-[45%] max-w-[60%] text-right">
            <ul className="text-[#E9C87D] text-[14px] leading-[1.35] tracking-wide">
              {infoRight.map((row, i) => (
                <li
                  key={i}
                  className={`py-1 ${i > 0 ? 'border-t border-[#E9C87D]/40' : ''}`}
                >
                  {row}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ NAKŁADKA REZERWACJI */}
      {l.isReserved && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
          <span className="font-[Bungee] text-[#d9d9d9] text-[clamp(22px,4vw,42px)] tracking-[2px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            REZERWACJA
          </span>
        </div>
      )}
    </Link>
  )
}
