// src/app/oferta/[slug]/not-found.tsx

export default function NotFound() {
  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] grid place-items-center p-8">
      <div className="text-center">
        <h1 className="font-[Bungee] text-[#E9C87D] text-[clamp(22px,5vw,48px)] mb-4">
          NIE ZNALEZIONO TEJ OFERTY
        </h1>
        <a
          href="/domy"
          className="underline text-[#d9d9d9] hover:text-[#E9C87D] transition-colors duration-300"
        >
          Wróć do listy ofert
        </a>
      </div>
    </main>
  );
}