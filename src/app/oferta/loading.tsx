/* Cienki pasek u góry zamiast pełnoekranowego logo: treść nie jest zasłaniana,
   a po kliknięciu w ofertę widać, że strona się wczytuje.

   Pasek siedzi w pustym bloku na całą wysokość ekranu (w normalnym przepływie, nie fixed).
   Bez tego na czas wczytywania na stronie była tylko stopka: na telefonie (stopka wyższa
   niż ekran) po kliknięciu w ofertę z listy widać było sam dół strony, a Next.js, który
   pomija elementy fixed, przewijał do stopki zamiast na górę oferty. */
export default function Loading() {
  return (
    <div aria-hidden className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-[9997] h-[2px] overflow-hidden">
        <div className="m2-bar h-full w-1/3 bg-[#b8913a]" />
      </div>
      <style>{`
        @keyframes m2-bar { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
        .m2-bar { animation: m2-bar 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
