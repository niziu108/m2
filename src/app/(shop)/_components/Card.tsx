'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { cldOptimize } from '@/lib/img';

export function toPLN(n: number) {
  return n.toLocaleString('pl-PL') + ' zł';
}

export type CardListing = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string | null;
  price: number;
  area: number | null;
  bullets: string[];
  isReserved: boolean;
  location: string | null;
  listingNumber: string;
  category?: string | null;
  photos?: string[];
};

/** W bazie zdarza się sam liczba pokoi ("3"). Na karcie ma być "3 pokoje". */
function opisCechy(bullet: string, category?: string | null) {
  const txt = bullet.trim();
  if (!/^\d+$/.test(txt)) return txt;
  if (category !== 'DOM' && category !== 'MIESZKANIE') return txt;

  const n = Number(txt);
  const last = n % 10;
  const twoLast = n % 100;
  if (n === 1) return '1 pokój';
  const few = last >= 2 && last <= 4 && !(twoLast >= 12 && twoLast <= 14);
  return `${n} ${few ? 'pokoje' : 'pokoi'}`;
}

function IconPin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function IconCamera({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}

/** Zdjęcia oferty: przewijanie palcem na telefonie, strzałki na komputerze. */
function Foto({
  photos,
  title,
  reserved,
}: {
  photos: string[];
  title: string;
  reserved: boolean;
}) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  const many = photos.length > 1;
  const go = (dir: number) => setI((v) => (v + dir + photos.length) % photos.length);

  const arrow = (dir: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (many) go(dir);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!many) return;
    startX.current = e.changedTouches[0]?.clientX ?? null;
    endX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!many) return;
    endX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!many) return;
    const a = startX.current;
    const b = endX.current ?? e.changedTouches[0]?.clientX ?? null;
    startX.current = null;
    if (a == null || b == null) return;
    const diff = a - b;
    if (Math.abs(diff) < 40) return;
    e.preventDefault();
    e.stopPropagation();
    go(diff > 0 ? 1 : -1);
  };

  return (
    <div
      className="relative overflow-hidden bg-black/5 aspect-[16/10] lg:aspect-auto lg:h-full lg:w-[42%] lg:shrink-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {photos.length ? (
        <>
          <img
            src={cldOptimize(photos[i] ?? photos[0], 900)}
            alt={title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* delikatny cień tylko przy krawędziach, zdjęcie zostaje jasne */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

          <img
            src="/logo.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 w-[56px] opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
          />

          {reserved && (
            <span className="absolute left-3 top-3 rounded-full bg-[#E9C87D] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#2a2117] shadow-lg">
              REZERWACJA
            </span>
          )}

          {many && (
            <>
              <button
                type="button"
                aria-label="Poprzednie zdjęcie"
                onClick={arrow(-1)}
                className="absolute left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-black/45 text-xl leading-none text-white backdrop-blur-sm transition lg:opacity-0 lg:group-hover:opacity-100"
              >
                &#8249;
              </button>
              <button
                type="button"
                aria-label="Następne zdjęcie"
                onClick={arrow(1)}
                className="absolute right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-black/45 text-xl leading-none text-white backdrop-blur-sm transition lg:opacity-0 lg:group-hover:opacity-100"
              >
                &#8250;
              </button>
              <span className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] tabular-nums text-white backdrop-blur-sm">
                <IconCamera className="h-3.5 w-3.5" />
                {i + 1}/{photos.length}
              </span>
            </>
          )}
        </>
      ) : (
        <div className="grid h-full place-items-center text-sm text-[var(--foreground-soft)]">
          zdjęcia wkrótce
        </div>
      )}
    </div>
  );
}

export default function Card({ l }: { l: CardListing }) {
  const photos = (
    l.photos && l.photos.length ? l.photos : l.coverImageUrl ? [l.coverImageUrl] : []
  ).filter(Boolean);

  const rawBullet = (l.bullets || []).filter(Boolean)[0] || '';
  const bullet = rawBullet ? opisCechy(rawBullet, l.category) : '';
  const perM2 = l.area && l.area > 0 ? Math.round(l.price / l.area) : null;

  const chips = [
    l.area ? `${l.area} m²` : '',
    bullet,
    l.listingNumber ? `nr ${l.listingNumber}` : '',
  ].filter(Boolean);

  return (
    <Link
      href={`/oferta/${l.slug}`}
      prefetch={false}
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-[var(--surface)] transition duration-200 hover:border-[#E9C87D] hover:shadow-[0_14px_36px_rgba(20,18,14,0.10)] lg:flex lg:h-[236px] lg:items-stretch"
    >
      <Foto photos={photos} title={l.title} reserved={l.isReserved} />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5 lg:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-[Bungee] gold-grad text-[clamp(20px,5vw,28px)] leading-none">
            {toPLN(l.price)}
          </span>
          {perM2 && (
            <span className="text-[13px] tabular-nums text-[var(--foreground-soft)]">
              {perM2.toLocaleString('pl-PL')} zł/m²
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-[var(--foreground)] sm:text-[17px] lg:text-[19px]">
          {l.title}
        </h3>

        {l.location && (
          <div className="flex min-w-0 items-center gap-1.5 text-[14px] text-[var(--foreground-soft)]">
            <IconPin className="h-4 w-4 shrink-0 text-[#b1861d]" />
            <span className="truncate">{l.location}</span>
          </div>
        )}

        {chips.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {chips.map((c, idx) => (
              <li
                key={idx}
                className="rounded-full border border-black/10 px-2.5 py-1 text-[12px] leading-none text-[var(--foreground-soft)]"
              >
                {c}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-2 hidden text-[13px] font-semibold tracking-wide text-[#b1861d] lg:inline-block">
          Zobacz ofertę &rarr;
        </span>
      </div>
    </Link>
  );
}
