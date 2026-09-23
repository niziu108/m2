'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X, Pencil, FileCheck, KeyRound, ArrowRight } from 'lucide-react';

// Baner reklamowy oferty Hausmar Development (ul. Iglasta, Bełchatów).
// Pokazuje się raz na sesję, po chwili od wejścia. Zamykany krzyżykiem, kliknięciem w tło lub Esc.
const OFFER_HREF = '/oferta/d44';
const SS_KEY = 'promo-hausmar-closed';
const DELAY_MS = 1500;

const FEATURES = [
  { Icon: Pencil, title: 'Twój projekt', text: 'Mówisz, jak ma wyglądać. Nasz projektant to rysuje.' },
  { Icon: FileCheck, title: 'Jedna cena', text: 'Konkretna wycena z góry. Bez dopłat po drodze.' },
  { Icon: KeyRound, title: 'Stan deweloperski', text: 'Budujemy całość i przekazujemy dom gotowy do wykończenia.' },
];

export default function PromoHausmar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const excluded = pathname?.startsWith('/admin') || pathname === OFFER_HREF;

  useEffect(() => {
    if (excluded) return;
    try {
      if (sessionStorage.getItem(SS_KEY) === '1') return;
    } catch {}
    // na stronie głównej czekamy, aż zniknie loader wejściowy (~2 s)
    const t = setTimeout(() => setOpen(true), pathname === '/' ? 2600 : DELAY_MS);
    return () => clearTimeout(t);
    // tylko przy pierwszym wejściu, nie przy każdej nawigacji
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    try { sessionStorage.setItem(SS_KEY, '1'); } catch {}
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || excluded) return null;

  return (
    <div
      className="promo-fade fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/55 p-3 sm:p-6"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Oferta Hausmar Development"
    >
      <div
        className="promo-pop relative flex w-full max-w-[760px] max-h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          background: 'radial-gradient(120% 80% at 100% 0%, #f6ead3 0%, #fbf8f1 45%, #fbf8f1 100%)',
          color: '#1f1c17',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Zamknij reklamę"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#1f1c17] shadow-sm ring-1 ring-black/5 transition hover:bg-white"
        >
          <X size={18} strokeWidth={2.2} />
        </button>

        <div className="overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-10 sm:pb-9 sm:pt-8">
          {/* nagłówek */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-black/10 pb-3 pr-10 sm:pb-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b655b] sm:text-[12px]">
              Oferta <b className="font-bold text-[#1f1c17]">Hausmar</b> Development
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a87c24] sm:text-[11px]">
              Bełchatów · ul. Iglasta
            </p>
          </div>

          {/* hasło */}
          <h2 className="mt-6 text-center text-[30px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:mt-8 sm:text-[48px]">
            Ty wybierasz dom.
            <br />
            <span className="text-[#b08530]">My robimy całą resztę.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-center text-[14px] leading-relaxed text-[#6b655b] sm:mt-4 sm:text-[16px]">
            Pięć działek przy ul. Iglastej w Bełchatowie. Projekt rysowany pod Twój pomysł, wycena z góry, budowa
            w&nbsp;jednej umowie.
          </p>

          {/* trzy kafle */}
          <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3">
            {FEATURES.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-xl border border-[#ece4d4] bg-white px-4 py-3 sm:flex-col sm:gap-0 sm:px-4 sm:py-6 sm:text-center"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e6c685] text-[#1f1c17] sm:h-12 sm:w-12">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[15px] font-bold tracking-[-0.02em] sm:mt-4 sm:text-[17px]">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#6b655b] sm:mt-1.5">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* cena + CTA */}
          <div className="mt-5 flex flex-col items-center gap-4 border-t border-black/10 pt-5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-12 sm:pt-6">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b655b]">
                Dom w stanie deweloperskim od
              </p>
              <p className="mt-1 text-[34px] font-extrabold leading-none tracking-[-0.03em] sm:text-[42px]">
                6 500 <span className="text-[16px] font-semibold text-[#6b655b] sm:text-[18px]">zł/m²</span>
              </p>
              <a href="tel:+48605071605" className="mt-1.5 inline-block text-[13px] font-semibold !text-[#a87c24]">
                tel. 605 071 605
              </a>
            </div>
            <Link
              href={OFFER_HREF}
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full bg-[#b08530] px-7 py-3.5 text-[17px] font-bold tracking-[-0.01em] !text-white shadow-md transition hover:bg-[#9b742a] sm:px-9 sm:py-4 sm:text-[19px]"
            >
              Zobacz ofertę <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes promoFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes promoPop { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
        .promo-fade { animation: promoFade 0.25s ease-out; }
        .promo-pop { animation: promoPop 0.3s ease-out; }
      `}</style>
    </div>
  );
}
