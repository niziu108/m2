// src/app/oferta/[slug]/Gallery.tsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function Gallery({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (idx >= images.length) setIdx(0);
  }, [images.length, idx]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-2xl border border-white/10 bg-black/30 grid place-items-center min-w-0">
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

  return (
    <>
      {/* DUŻE ZDJĘCIE */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 min-w-0">
        <div className="aspect-video relative min-w-0">
          <img
            src={curr}
            alt=""
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
            onClick={() => setOpen(true)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="prev"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="next"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center bg-black/50 hover:bg-black/70 text-white rounded-full"
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
                    i === idx ? 'border-[#E9C87D] ring-2 ring-[#E9C87D33]' : 'border-white/10'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
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
            className="absolute top-3 right-3 sm:top-6 sm:right-6 px-4 h-10 rounded-xl border border-white/30 text-white/90 hover:bg-white/10"
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
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              >
                ›
              </button>
            </>
          )}

          {/* Kontener, żeby klik w obraz nie zamykał */}
          <div
            className="max-w-[92vw] sm:max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={curr}
              alt=""
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
