'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/** Czy człowiek przeszedł już jakąś stronę w obrębie witryny (czytane przez przycisk „Wróć”). */
export const navState = { internal: false };

/* Cienki złoty pasek u góry po kliknięciu w link. Stara strona zostaje widoczna, aż nowa będzie
   gotowa, więc nie ma pustego ekranu ani samej stopki, a mimo to widać, że coś się wczytuje. */
export default function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    navState.internal = true;
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target as Element | null;
      // strzałki zdjęć w karcie oferty leżą wewnątrz linku, ale nie przechodzą na inną stronę
      if (!el?.closest || el.closest('button')) return;
      const a = el.closest('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setActive(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // bezpiecznik: pasek nigdy nie zostaje na stałe
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 10000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[10002] h-[2px] overflow-hidden">
      <div className="m2-bar h-full w-1/3 bg-[#b8913a]" />
    </div>
  );
}
