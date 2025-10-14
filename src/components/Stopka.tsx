'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const ACCENT = "#E9C87D";
const FG = "#d9d9d9";
const BG = "#131313";

export default function Stopka() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";

  const goSmooth = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkCls =
    "font-bungee uppercase tracking-[0.035em] hover:opacity-90 text-[#E9C87D]";

  return (
    <footer className="text-[#d9d9d9]" style={{ backgroundColor: BG }}>
      {/* Cieniutka żółta linia na samej górze stopki */}
      <div className="w-full border-t-[0.5px]" style={{ borderColor: ACCENT }} />

      {/* GÓRA */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 text-center md:text-left">
          {/* Lewa: DANE FIRMY */}
          <div className="order-2 md:order-1">
            <div className="space-y-2 md:space-y-1 text-base leading-7">
              <div className="font-bungee uppercase tracking-[0.035em] text-[#E9C87D]">
                DANE FIRMY:
              </div>
              <div>M2 Nieruchomości</div>
              <div>NIP: 7691829620</div>


              <div className="font-bungee uppercase pt-2 tracking-[0.035em] text-[#E9C87D]">
                ADRES:
              </div>
              <div>97-400, Bełchatów</div>
              <div>Mazury 10</div>
              <div>Działamy mobilnie</div>

              <div className="font-bungee uppercase pt-2 tracking-[0.035em] text-[#E9C87D]">
                KONTAKT:
              </div>

              {/* Wymuszamy jasny kolor (nie żółty) */}
              <div className="text-[#f3f3f3]">
                <a
                  href="tel:+48605071605"
                  className="hover:underline text-inherit"
                  style={{ color: "#f3f3f3" }}
                >
                  605 071 605
                </a>
              </div>
              <div className="text-[#f3f3f3]">
                <a
                  href="mailto:biuro@m2.nieruchomosci.pl"
                  className="hover:underline text-inherit"
                  style={{ color: "#f3f3f3" }}
                >
                  biuro@m2.nieruchomosci.pl
                </a>
              </div>
            </div>
          </div>

          {/* Środek: logo */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/logo.webp"
              alt="M2 Nieruchomości"
              width={280}
              height={120}
              className="h-[150px] w-auto md:h-[190px]"
              priority
            />
          </div>

          {/* Prawa: menu */}
          <nav className="order-3 text-base md:text-lg leading-7 md:leading-8 md:text-right">
            <ul className="space-y-2 md:space-y-2.5 md:pr-[2px]">
              <li>
                {onHome ? (
                  <Link href="#hero" onClick={(e) => goSmooth(e, "hero")} className={linkCls}>
                    STRONA GŁÓWNA
                  </Link>
                ) : (
                  <Link href="/#hero" className={linkCls}>STRONA GŁÓWNA</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#jak-dzialamy" onClick={(e) => goSmooth(e, "jak-dzialamy")} className={linkCls}>
                    JAK DZIAŁAMY?
                  </Link>
                ) : (
                  <Link href="/#jak-dzialamy" className={linkCls}>JAK DZIAŁAMY?</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#oferta" onClick={(e) => goSmooth(e, "oferta")} className={linkCls}>
                    OFERTA
                  </Link>
                ) : (
                  <Link href="/#oferta" className={linkCls}>OFERTA</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#o-nas" onClick={(e) => goSmooth(e, "o-nas")} className={linkCls}>
                    O NAS
                  </Link>
                ) : (
                  <Link href="/#o-nas" className={linkCls}>O NAS</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#kontakt" onClick={(e) => goSmooth(e, "kontakt")} className={linkCls}>
                    KONTAKT
                  </Link>
                ) : (
                  <Link href="/#kontakt" className={linkCls}>KONTAKT</Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* DÓŁ — cienki ŻÓŁTY separator */}
      <div className="border-t-[0.5px]" style={{ borderColor: ACCENT }}>
        <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-[12px] leading-snug max-w-4xl text-center sm:text-left">
            Opisy ofert zawartych na stronie internetowej sporządzane są na podstawie oględzin nieruchomości
            oraz informacji uzyskanych od właścicieli, mogą podlegać aktualizacji i nie stanowią ofert
            określonych w art. 66 i następnych K.C.
          </p>
          <Link
            href="/polityka-prywatnosci"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] underline-offset-4 hover:underline whitespace-nowrap text-center sm:text-right"
          >
            Polityka prywatności
          </Link>
        </div>

        {/* Podpis */}
        <div className="mx-auto max-w-6xl px-8 pb-3">
          <p className="text-[11px] text-center" style={{ color: FG }}>
            design:{" "}
            <a href="mailto:biuro@ultimareality.pl" className="hover:underline text-inherit">
              biuro@ultimareality.pl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
