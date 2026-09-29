/* Cienki pasek u góry zamiast pełnoekranowego logo: treść nie jest zasłaniana,
   a po kliknięciu w ofertę widać, że strona się wczytuje. */
export default function Loading() {
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[9997] h-[2px] overflow-hidden">
      <div className="m2-bar h-full w-1/3 bg-[#b8913a]" />
      <style>{`
        @keyframes m2-bar { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
        .m2-bar { animation: m2-bar 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
