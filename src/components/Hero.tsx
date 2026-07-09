'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATS = [
  { label: "Domy", value: "/domy" },
  { label: "Mieszkania", value: "/mieszkania" },
  { label: "Działki", value: "/dzialki" },
  { label: "Inne", value: "/inne" },
];

export default function Hero() {
  const router = useRouter();
  const [cat, setCat] = useState("");

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
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center select-none px-6">
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
            <div className="relative flex-1 text-left">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                style={{ accentColor: "#E9C87D" }}
                className="w-full appearance-none bg-white text-[#23201b] text-[16px] rounded-xl border border-black/10 pl-4 pr-12 py-3.5 cursor-pointer focus:outline-none focus:border-[#c8951a] focus:ring-2 focus:ring-[#E9C87D]"
              >
                <option value="" disabled hidden>Czego szukasz?</option>
                {CATS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {/* Wyraźna strzałka w dół */}
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b1861d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
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
