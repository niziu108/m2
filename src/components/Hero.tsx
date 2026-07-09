'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const CATS = [
  { label: "Domy", value: "/domy" },
  { label: "Mieszkania", value: "/mieszkania" },
  { label: "Działki", value: "/dzialki" },
  { label: "Inne", value: "/inne" },
];

export default function Hero() {
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
    router.push(cat || "/domy");
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
            w-[160px]
            sm:w-[160px]
            md:w-[200px]
            h-auto
            mb-[0.16em]
            opacity-95
            drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)]
          "
        />

        {/* NAPIS */}
        <h1
          className="
            font-bungee
            text-[#dfba61]
            leading-[1.25]
            drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]
            text-[clamp(28px,8vw,56px)]
            sm:text-[clamp(26px,5vw,58px)]
            max-w-[95%]
            sm:max-w-[80%]
            md:max-w-[70%]
            lg:max-w-[60%]
          "
        >
          <span className="block sm:hidden">
            ZNAJDŹ MIEJSCE, <br /> KTÓRE POKOCHASZ.
          </span>
          <span className="hidden sm:block">
            ZNAJDŹ MIEJSCE, <br /> KTÓRE POKOCHASZ.
          </span>
        </h1>

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
      </div>
    </section>
  );
}
