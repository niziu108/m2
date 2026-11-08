// src/app/oferta/[slug]/not-found.tsx
import Link from 'next/link';
import NajnowszeOferty from '@/components/NajnowszeOferty';

/* Sprzedana lub zdjęta oferta: stare linki z Google i Facebooka prowadzą tutaj.
   Zamiast ślepej ściany pokazujemy, co jest teraz w ofercie. */
export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)]">
      <section className="px-6 pt-24 pb-14 text-center">
        <h1 className="font-display text-[var(--ink)] text-[clamp(32px,5vw,52px)] leading-tight">
          Ta oferta nie jest już dostępna
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--foreground-soft)]">
          Nieruchomość mogła zostać sprzedana albo oferta została wycofana. Zobacz, co mamy teraz, albo zadzwoń:
          możemy szukać dla Ciebie na bieżąco.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/nieruchomosci" className="rounded-xl bg-[#E9C87D] px-5 py-2.5 font-semibold !text-[#2a2117]">
            Zobacz wszystkie oferty
          </Link>
          <a
            href="tel:+48605071605"
            className="rounded-xl border border-[#E9C87D] px-5 py-2.5 font-semibold !text-[var(--gold-ink)]"
          >
            Zadzwoń: 605 071 605
          </a>
        </div>
      </section>
      <NajnowszeOferty />
    </main>
  );
}
