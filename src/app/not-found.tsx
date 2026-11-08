import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)] grid place-items-center p-8">
      <div className="text-center">
        <h1 className="font-display text-[var(--ink)] text-[clamp(32px,5vw,52px)] leading-tight">
          Nie znaleziono tej strony
        </h1>
        <p className="mt-3 text-[var(--foreground-soft)]">Adres mógł się zmienić albo strona została usunięta.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/nieruchomosci" className="rounded-xl bg-[#E9C87D] px-5 py-2.5 font-semibold !text-[#2a2117]">
            Zobacz oferty
          </Link>
          <Link href="/" className="rounded-xl border border-[#E9C87D] px-5 py-2.5 font-semibold !text-[var(--gold-ink)]">
            Strona główna
          </Link>
        </div>
      </div>
    </main>
  );
}
