'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const BG = '#131313';
const FG = '#d9d9d9';
const ACCENT = '#E9C87D';

type TargetId = 'hero' | 'jak-dzialamy' | 'oferta' | 'o-nas' | 'kontakt';
type MenuItem = { label: string; id: TargetId };

const MENU: MenuItem[] = [
  { label: 'STRONA GŁÓWNA', id: 'hero' },
  { label: 'JAK DZIAŁAMY?', id: 'jak-dzialamy' },
  { label: 'OFERTA', id: 'oferta' },
  { label: 'O NAS', id: 'o-nas' },
  { label: 'KONTAKT', id: 'kontakt' },
];

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function scrollToId(id: TargetId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function GlobalMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lastOverflow = useRef<string>('');

  // Blokuj scroll tła przy otwartym overlayu
  useEffect(() => {
    if (open) {
      lastOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = lastOverflow.current;
      };
    }
  }, [open]);

  // ESC zamyka
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Przejście do sekcji po kliknięciu
  const handleGo = (id: TargetId) => {
    setOpen(false);
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    setTimeout(() => scrollToId(id), 80);
  };

  // Klasy linków – większe na tel
  const linkCls =
    'font-bungee uppercase tracking-wide text-[#E9C87D] ' +
    'text-[clamp(28px,9vw,56px)] sm:text-[clamp(28px,6vw,60px)] ' +
    'hover:opacity-85 transition-opacity';

  return (
    <>
      {/* BURGER/CRoss – zawsze PRZYWIERZCHNIE w prawym górnym rogu */}
      <motion.button
        aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
        onClick={() => setOpen((s) => !s)}
        className="fixed top-2 right-3 sm:top-3 sm:right-4 z-[110] p-2 rounded-lg"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ type: 'tween', duration: 0.35 }}
        style={{ color: ACCENT, background: 'transparent', willChange: 'transform' }}
      >
        {/* swap ikon z delikatnym crossfade */}
        <div className="relative w-9 h-9">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.9 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <BurgerIcon className="w-8 h-8 sm:w-9 sm:h-9" />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.9 }}
            transition={{ duration: 0.2, delay: open ? 0.05 : 0 }}
          >
            <CrossIcon className="w-8 h-8 sm:w-9 sm:h-9" />
          </motion.div>
        </div>
      </motion.button>

      {/* OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="menu-overlay"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: BG, color: FG }}
            aria-modal="true"
            role="dialog"
          >
            {/* Klik w tło zamyka */}
            <button
              aria-hidden
              onClick={() => setOpen(false)}
              className="absolute inset-0 -z-10"
            />

            <nav className="relative flex-1 w-full">
              <ul className="h-full w-full max-w-5xl mx-auto px-6 pt-24 pb-28 flex flex-col items-center justify-center gap-6 text-center">
                {MENU.map((item) => (
                  <li key={item.id}>
                    <button onClick={() => handleGo(item.id)} className={linkCls}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
