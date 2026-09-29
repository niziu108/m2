// src/app/oferta/[slug]/not-found.tsx

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)] grid place-items-center p-8">
      <div className="text-center">
        <h1 className="font-display text-[var(--ink)] text-[clamp(32px,5vw,52px)] mb-4">
          Nie znaleziono tej oferty
        </h1>
        <a
          href="/domy"
          className="underline text-[var(--foreground)] hover:text-[var(--gold-ink)] transition-colors duration-300"
        >
          Wróć do listy ofert
        </a>
      </div>
    </main>
  );
}