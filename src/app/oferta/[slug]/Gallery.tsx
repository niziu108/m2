// src/app/oferta/[slug]/Gallery.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { cldOptimize } from '@/lib/img';

export default function Gallery({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const touchMoved = useRef(false);

  useEffect(() => {
    if (idx >= images.length) setIdx(0);
  }, [images.length, idx]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-2xl border border-black/10 bg-black/30 grid place-items-center min-w-0">
        brak zdjęć
      </div>
    );
  }

  const curr = images[idx];

  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // ❌ USUNIĘTO auto-scroll miniaturek
  const canScroll = images.length > 5;
  const scrollBy = (dx: number) => railRef.current?.scrollBy({ left: dx, behavior: 'smooth' });

  // Przewijanie zdjęć palcem (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
    touchMoved.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    if (Math.abs(e.touches[0].clientX - touchX.current) > 10) touchMoved.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <>
      {/* DUŻE ZDJĘCIE */}
      <div className="relative overflow-hidden sm:rounded-2xl border-0 sm:border sm:border-black/10 bg-[var(--surface)] min-w-0">
        <div
          className="aspect-video relative min-w-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={cldOptimize(curr, 1400)}
            alt=""
            data-savable
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
            onClick={() => {
              if (!touchMoved.current) setOpen(true);
            }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="prev"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center bg-black/60 hover:bg-black/80 text-white rounded-full text-2xl leading-none shadow-lg"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="next"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center bg-black/60 hover:bg-black/80 text-white rounded-full text-2xl leading-none shadow-lg"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* MINIATURKI — 1 rząd */}
        {images.length > 1 && (
          <div className="mt-3 relative min-w-0">
            {canScroll && (
              <>
                <button
                  onClick={() => scrollBy(-320)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 grid place-items-center bg-black/60 hover:bg-black/80 text-white"
                  aria-label="Przewiń w lewo"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollBy(320)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 grid place-items-center bg-black/60 hover:bg-black/80 text-white"
                  aria-label="Przewiń w prawo"
                >
                  ›
                </button>
              </>
            )}

            <div
              ref={railRef}
              className="flex gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6 md:px-8 min-w-0"
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`shrink-0 w-[120px] sm:w-[140px] md:w-[160px] aspect-[4/3] overflow-hidden border rounded ${
                    i === idx ? 'border-[#E9C87D] ring-2 ring-[#E9C87D33]' : 'border-black/10'
                  }`}
                >
                  <img src={cldOptimize(src, 320)} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-2 sm:p-4"
          onClick={() => setOpen(false)}
        >
          {/* Zamknij */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 px-4 h-10 rounded-xl bg-black/60 hover:bg-black/80 text-white ring-1 ring-white/25 shadow-lg"
          >
            Zamknij ✕
          </button>

          {/* Strzałki */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Poprzednie zdjęcie"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl leading-none shadow-lg ring-1 ring-white/25"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Następne zdjęcie"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-12 w-12 grid place-items-center rounded-full bg-black/60 hover:bg-black/80 text-white text-3xl leading-none shadow-lg ring-1 ring-white/25"
              >
                ›
              </button>
            </>
          )}

          {/* Kontener, żeby klik w obraz nie zamykał */}
          <div
            className="max-w-[92vw] sm:max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={cldOptimize(curr, 2000)}
              alt=""
              data-savable
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
