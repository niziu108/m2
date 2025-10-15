"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GoogleReviewCard, { type Review } from "./GoogleReviewCard";
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from "lucide-react";

const GOLD = "#E9C87D";

/** 1 na tel, 3 na desktopie */
function useVisibleCount() {
  const [n, setN] = useState<number>(
    typeof window === "undefined" ? 1 : window.innerWidth >= 1024 ? 3 : 1
  );
  useEffect(() => {
    const onResize = () => setN(window.innerWidth >= 1024 ? 3 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return n;
}

type ApiResp =
  | {
      reviews: Review[];
      source: "v1" | "legacy" | null;
      week?: { year: number; week: number };
      warn?: string;
      error?: undefined;
    }
  | { reviews: Review[]; source: null; error: string };

export default function GoogleOpinie() {
  const [data, setData] = useState<ApiResp | null>(null);
  const [idx, setIdx] = useState(0);
  const visible = useVisibleCount();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/google-reviews", { cache: "no-store" });
        const json: ApiResp = await res.json();
        const cut = Array.isArray(json.reviews) ? json.reviews.slice(0, 9) : [];
        if (!alive) return;
        setData({ ...(json as any), reviews: cut });
      } catch {
        if (!alive) return;
        setData({
          reviews: [],
          source: null,
          error: "Nie udało się pobrać opinii.",
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const reviews = data?.reviews ?? [];
  const maxIdx = useMemo(() => {
    if (!reviews.length) return 0;
    return Math.max(0, reviews.length - visible);
  }, [reviews.length, visible]);

  const go = (dir: -1 | 1) =>
    setIdx((i) => Math.min(maxIdx, Math.max(0, i + dir)));

  if (!data) {
    return (
      <section className="px-4 py-10 lg:py-14 bg-[#131313] border-t border-white/5">
        <div className="mx-auto w-full max-w-[min(1400px,95vw)]">
          <header className="mb-3 text-center">
            <h2 className="font-[Bungee] text-[#E9C87D] tracking-[2px] text-[clamp(26px,5vw,48px)]">
              OPINIE KLIENTÓW
            </h2>
            <p className="text-xs text-white/60 mt-1">Ładuję opinie…</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[220px] rounded-2xl border border-white/10 bg-[#0b0b0b] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section className="px-4 py-10 lg:py-14 bg-[#131313] border-t border-white/5">
        <div className="mx-auto w-full max-w-[min(1400px,95vw)]">
          <header className="mb-3 text-center">
            <h2 className="font-[Bungee] text-[#E9C87D] tracking-[2px] text-[clamp(26px,5vw,48px)]">
              OPINIE KLIENTÓW
            </h2>
            <p className="text-xs text-white/60 mt-1">Brak opinii do pokazania.</p>
          </header>
        </div>
      </section>
    );
  }

  const itemBasis = `${100 / visible}%`;
  const translate = `translateX(-${(idx * 100) / visible}%)`;
  const googleUrl = reviews.find((r) => r.url)?.url;

  return (
    <section className="px-4 py-10 lg:py-14 bg-[#131313] border-t border-white/5">
      <div className="mx-auto w-full max-w-[min(1400px,95vw)]">
        <header className="mb-2 text-center">
          <h2 className="font-[Bungee] text-[#E9C87D] tracking-[2px] text-[clamp(26px,5vw,48px)]">
            OPINIE KLIENTÓW
          </h2>

          {googleUrl && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-1 text-xs text-white/70 hover:text-[#E9C87D] transition"
            >
              <span className="underline underline-offset-4">
                zobacz wszystkie opinie w Google
              </span>
              <SquareArrowOutUpRight
                className="size-3.5 opacity-80"
                style={{ color: GOLD }}
                aria-hidden="true"
              />
            </a>
          )}

          {"warn" in data! && (data as any).warn ? (
            <p className="text-[11px] text-white/40 mt-1">{(data as any).warn}</p>
          ) : null}
        </header>

        <div className="relative">
          {/* tor */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: translate }}
            >
              {reviews.map((r, i) => (
                <div
                  key={`${i}-${r.authorName}`}
                  style={{ flex: `0 0 ${itemBasis}` }}
                  className="px-2"
                >
                  <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] h-full">
                    <GoogleReviewCard r={r} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STRZAŁKI overlay – desktop (złote ikony) */}
          <div className="hidden lg:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
              <button
                onClick={() => go(-1)}
                disabled={idx === 0}
                className="pointer-events-auto ml-[-8px] inline-flex items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur px-3 py-3 disabled:opacity-40 hover:bg-black/60 transition"
                aria-label="Poprzednia opinia"
              >
                <ChevronLeft className="size-5" style={{ color: GOLD }} />
              </button>
              <button
                onClick={() => go(1)}
                disabled={idx === maxIdx}
                className="pointer-events-auto mr-[-8px] inline-flex items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur px-3 py-3 disabled:opacity-40 hover:bg-black/60 transition"
                aria-label="Następna opinia"
              >
                <ChevronRight className="size-5" style={{ color: GOLD }} />
              </button>
            </div>
          </div>

          {/* MOBILE: strzałki OBOK SIEBIE, bez licznika */}
          <div className="flex lg:hidden items-center justify-center gap-3 mt-4">
            <button
              onClick={() => go(-1)}
              disabled={idx === 0}
              className="inline-flex rounded-xl border px-3 py-2 disabled:opacity-40 transition"
              style={{
                borderColor: `${GOLD}66`,
                background: "#131313",
              }}
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft className="size-5" style={{ color: GOLD }} />
            </button>

            <button
              onClick={() => go(1)}
              disabled={idx === maxIdx}
              className="inline-flex rounded-xl border px-3 py-2 disabled:opacity-40 transition"
              style={{
                borderColor: `${GOLD}66`,
                background: "#131313",
              }}
              aria-label="Następna opinia"
            >
              <ChevronRight className="size-5" style={{ color: GOLD }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}