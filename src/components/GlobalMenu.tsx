'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const BG = '#f4f2ec';
const FG = '#23201b';
const ACCENT = '#c9a24a';

type TargetId = 'hero' | 'jak-dzialamy' | 'oferta' | 'o-nas' | 'kontakt';
type MenuItem = { label: string; id?: TargetId; href?: string };

const MENU: MenuItem[] = [
  { label: 'Strona główna', id: 'hero' },
  { label: 'Jak działamy', id: 'jak-dzialamy' },
  // Oferta prowadzi prosto do wyszukiwarki ze wszystkimi ofertami
  { label: 'Oferta', href: '/nieruchomosci' },
  { label: 'Bezpłatna wycena', href: '/wycena-nieruchomosci' },
  { label: 'O nas', id: 'o-nas' },
  { label: 'Kontakt', id: 'kontakt' },
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

/* Animacje na samym CSS: menu jest na każdej podstronie, więc biblioteka animacji
   dokładała ciężki JavaScript do każdego wejścia. Linki siedzą w HTML także przy
   zamkniętym menu, dzięki czemu Google widzi główną nawigację. */
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
    'font-display !text-[var(--ink)] hover:!text-[var(--accent-deep)] ' +
    'text-[clamp(34px,9.5vw,60px)] sm:text-[clamp(36px,6vw,64px)] leading-none ' +
    'transition-colors';

  return (
    <>
      {/* BURGER/CRoss – zawsze PRZYWIERZCHNIE w prawym górnym rogu */}
      <button
        aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`fixed top-2 right-3 sm:top-3 sm:right-4 z-[110] p-2 rounded-lg bg-transparent transition-transform duration-300 ${
          open ? 'rotate-180' : ''
        }`}
        style={{ color: ACCENT }}
      >
        {/* swap ikon z delikatnym crossfade */}
        <div className="relative w-9 h-9">
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-200 ${
              open ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <BurgerIcon className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center transition duration-200 ${
              open ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <CrossIcon className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
        </div>
      </button>

      {/* OVERLAY */}
      <aside
        className={`fixed inset-0 z-[100] flex flex-col transition-[translate,opacity,visibility] duration-300 ease-out ${
          open ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'
        }`}
        style={{ backgroundColor: BG, color: FG }}
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        {/* Klik w tło zamyka */}
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 -z-10"
        />

        <nav className="relative flex-1 w-full">
          <ul className="h-full w-full max-w-5xl mx-auto px-6 pt-24 pb-28 flex flex-col items-center justify-center gap-6 text-center">
            {MENU.map((item) => (
              <li key={item.href ?? item.id}>
                {item.href ? (
                  <Link href={item.href} onClick={() => setOpen(false)} className={linkCls}>
                    {item.label}
                  </Link>
                ) : (
                  <button onClick={() => handleGo(item.id!)} className={linkCls}>
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
