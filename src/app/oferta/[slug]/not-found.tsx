// src/app/oferta/[slug]/not-found.tsx

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)] grid place-items-center p-8">
      <div className="text-center">
        <h1 className="font-[Bungee] text-[var(--gold-ink)] text-[clamp(22px,5vw,48px)] mb-4">
          NIE ZNALEZIONO TEJ OFERTY
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