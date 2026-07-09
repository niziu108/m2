'use client';

import Image from "next/image";

export default function Hero() {
  const scrollToId = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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

        {/* PRZYCISKI */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollToId("oferta")}
            className="
              w-[220px] sm:w-auto px-8 py-2.5 text-[16px] font-inter font-light
              tracking-[0.12em] uppercase text-[#dfba61] border border-[#dfba61]
              bg-transparent transition-all duration-300
              hover:bg-[#dfba61] hover:text-[#131313] active:scale-[0.97]
            "
          >
            ZOBACZ OFERTĘ
          </button>
          <button
            onClick={() => scrollToId("o-nas")}
            className="
              w-[220px] sm:w-auto px-8 py-2.5 text-[16px] font-inter font-light
              tracking-[0.12em] uppercase text-[#dfba61] border border-[#dfba61]
              bg-transparent transition-all duration-300
              hover:bg-[#dfba61] hover:text-[#131313] active:scale-[0.97]
            "
          >
            POZNAJ NAS
          </button>
        </div>
      </div>
    </section>
  );
}
