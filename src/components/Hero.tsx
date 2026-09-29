'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const CATS = [
  { label: "Wszystkie oferty", value: "/nieruchomosci" },
  { label: "Domy", value: "/domy" },
  { label: "Mieszkania", value: "/mieszkania" },
  { label: "Działki", value: "/dzialki" },
  { label: "Inne", value: "/inne" },
];

// Wizytówka Google z opiniami (ten sam PLACE_ID co w GoogleOpinie)
const REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJM50TlD4bGkcRCI5xxkS1cIo";

/** 1 opinia, 2-4 opinie, 5+ opinii (z wyjątkiem 12-14) */
function opinieLabel(n: number) {
  if (n === 1) return "opinia";
  const last = n % 10, twoLast = n % 100;
  return last >= 2 && last <= 4 && !(twoLast >= 12 && twoLast <= 14) ? "opinie" : "opinii";
}

type Rating = { ratingValue: number; reviewCount: number } | null;

export default function Hero({ rating = null }: { rating?: Rating }) {
  const router = useRouter();
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // otwieraj w górę gdy brak miejsca pod spodem
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // zamykanie po kliknięciu poza listą
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // lista ~4 pozycje; jeśli pod spodem mało miejsca, otwórz w górę
      setOpenUp(window.innerHeight - rect.bottom < 280);
    }
    setOpen((o) => !o);
  };

  const selectedLabel = CATS.find((c) => c.value === cat)?.label;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // bez wybranej kategorii pokazujemy po prostu wszystkie oferty
    router.push(cat || "/nieruchomosci");
  };

  return (
    <section
      id="hero" // ✅ ID dodane do sekcji
      className="relative w-full h-[100svh] overflow-hidden"
      aria-label="Sekcja hero M2 Nieruchomości"
    >
      {/* TŁO */}
      <Image
        src="/hero.webp"
        alt="M2 Nieruchomości Bełchatów, biuro nieruchomości"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />

      {/* PRZYCIEMNIENIE */}
      <div className="absolute inset-0 bg-black/40 z-[5]" />

      {/* TREŚĆ */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center select-none px-6 pb-[10vh] sm:pb-[8vh]">
        {/* LOGO */}
        <Image
          src="/logo.webp"
          alt="M2 Nieruchomości – logo"
          width={200}
          height={200}
          priority
          className="
            w-[132px]
            sm:w-[150px]
            md:w-[180px]
            h-auto
            mb-[0.16em]
            opacity-95
            drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]
          "
        />

        {/* NAPIS */}
        <h1 className="max-w-[95%] sm:max-w-[82%] md:max-w-[72%] lg:max-w-[62%]">
          {/* pierwsza linia nagłówka: fraza, na którą chcemy być w Google */}
          <span
            className="
              mb-4 block
              text-[#E9C87D]
              text-[clamp(11px,2.8vw,14px)]
              font-semibold uppercase
              tracking-[0.24em]
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]
            "
          >
            Biuro nieruchomości Bełchatów
          </span>

          <span
            className="
              block font-display text-white
              leading-[1.05]
              text-[clamp(40px,10vw,60px)] sm:text-[clamp(44px,6.4vw,84px)]
              drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]
            "
          >
            Znajdź miejsce, <br /> które pokochasz.
          </span>
        </h1>

        {/* PODTYTUŁ – co robimy i gdzie (ważne też dla Google) */}
        <p
          className="
            mt-4 max-w-[640px]
            text-white/95
            text-[clamp(14px,3.6vw,18px)]
            leading-snug
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]
          "
        >
          Domy, mieszkania i działki na sprzedaż w Bełchatowie i okolicy do 40 km.
        </p>

        {/* WYSZUKIWARKA */}
        <form
          onSubmit={onSearch}
          className="mt-8 w-full max-w-[520px] px-2"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-3 rounded-2xl bg-white/95 backdrop-blur p-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <div ref={boxRef} className="relative flex-1 text-left">
              <button
                ref={btnRef}
                type="button"
                onClick={toggleOpen}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="w-full flex items-center justify-between bg-white text-[16px] rounded-xl border border-black/10 pl-4 pr-3 py-3.5 focus:outline-none focus:border-[#c8951a] focus:ring-2 focus:ring-[#E9C87D]"
              >
                <span className={selectedLabel ? "text-[#23201b]" : "text-black/50"}>
                  {selectedLabel ?? "Czego szukasz?"}
                </span>
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#b1861d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {open && (
                <ul
                  role="listbox"
                  className={`absolute left-0 z-50 w-full rounded-xl border border-black/10 bg-white shadow-[0_14px_34px_rgba(0,0,0,0.25)] overflow-y-auto max-h-[45vh] ${
                    openUp ? "bottom-full mb-2" : "top-full mt-2"
                  }`}
                >
                  {CATS.map((c) => {
                    const active = cat === c.value;
                    return (
                      <li
                        key={c.value}
                        role="option"
                        aria-selected={active}
                        onClick={() => { setCat(c.value); setOpen(false); }}
                        className={`px-4 py-3 cursor-pointer text-[16px] transition-colors ${
                          active
                            ? "bg-[#E9C87D] text-[#2a2117] font-semibold"
                            : "text-[#23201b] hover:bg-[#E9C87D]/30"
                        }`}
                      >
                        {c.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#E9C87D] text-[#2a2117] font-semibold text-[16px] px-8 py-3.5 hover:brightness-105 active:scale-[0.98] transition"
            >
              Szukaj
            </button>
          </div>
        </form>

        {/* ZAUFANIE: ocena z wizytówki Google (to samo źródło co dane strukturalne) */}
        <a
          href={REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] sm:text-[14px] !text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          <span className="tracking-[0.12em] text-[#E9C87D]" aria-hidden>★★★★★</span>
          <span>
            {rating
              ? <><strong className="font-semibold">{rating.ratingValue.toFixed(1).replace('.', ',')}</strong> w Google · {rating.reviewCount} {opinieLabel(rating.reviewCount)}</>
              : <>Opinie klientów w Google</>}
          </span>
          <span className="hidden sm:inline text-white/60">|</span>
          <span className="hidden sm:inline">Kupujący nie płaci prowizji</span>
        </a>
      </div>
    </section>
  );
}
