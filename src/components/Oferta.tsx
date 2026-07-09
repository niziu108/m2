'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Item = { title: string; bgSrc: string; href: string };

const ITEMS: Item[] = [
  { title: 'DOMY',        bgSrc: '/domy.webp',        href: '/domy' },
  { title: 'MIESZKANIA',  bgSrc: '/mieszkania.webp',  href: '/mieszkania' },
  { title: 'DZIAŁKI',     bgSrc: '/dzialki.webp',     href: '/dzialki' },
  { title: 'INNE',        bgSrc: '/inne.webp',        href: '/inne' },
];

export default function Oferta() {
  return (
    <section
      id="oferta"
      className="relative mx-[calc(50%-50vw)] w-[100vw] h-[100svh] overflow-hidden"
      aria-label="Oferta"
    >
      <div className="grid w-full h-full grid-rows-4 md:grid-rows-2 md:grid-cols-2">
        {ITEMS.map((item, i) => (
          <Link
            key={item.title}
            href={item.href}
            className={[
              'relative isolate overflow-hidden',
              // 📱 Mobile: tylko linie między kaflami (góra/dół bez ramek)
              i === 0 ? 'border-t-0' : 'border-t-2',
              i === 3 ? 'border-b-0' : '',
              'border-white/70',
              // 💻 Desktop: zero ramek na kaflach (linie rysujemy osobno, żeby nie dublować)
              'md:border-0',
            ].join(' ')}
          >
            {/* TŁO */}
            <Image
              src={item.bgSrc}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={item.title === 'DOMY'}
            />

            {/* PRZYCIEMNIENIE */}
            <div className="absolute inset-0 bg-black/30" />

            {/* NAGŁÓWEK */}
            <div className="relative z-10 flex h-full w-full items-center justify-center text-center select-none p-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="font-[Bungee] uppercase text-[#E9C87D] text-[clamp(22px,4vw,52px)] tracking-[2px] drop-shadow-[0_0_10px_rgba(0,0,0,0.85)]"
              >
                {item.title}
              </motion.h2>
            </div>
          </Link>
        ))}
      </div>

      {/* 💻 Desktop: JEDNA linia pozioma i JEDNA pionowa na środku (brak zewnętrznych obwódek) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/70" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/70" />
      </div>
    </section>
  );
}
