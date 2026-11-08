'use client';

import { useEffect, useState } from 'react';

/* Pasek z ceną i telefonem na dole ekranu, tylko na telefonie. Po przewinięciu zdjęć numer zawsze
   jest pod kciukiem. Chowa się przy karcie kontaktu i stopce, żeby ich nie zasłaniać. */
export default function OfferCallBar({
  phone,
  price,
  listingNumber,
}: {
  phone: string;
  price: string;
  listingNumber?: string | null;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const SCROLL_FROM = 200;
    const inView = new Set<Element>();
    let scrolled = window.scrollY > SCROLL_FROM;
    const update = () => setShow(scrolled && inView.size === 0);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      update();
    });
    for (const el of [document.getElementById('kontakt-oferta'), document.querySelector('footer')]) {
      if (el) io.observe(el);
    }

    const onScroll = () => {
      const now = window.scrollY > SCROLL_FROM;
      if (now !== scrolled) {
        scrolled = now;
        update();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const digits = phone.replace(/\s+/g, '');
  const sms = `sms:${digits}?&body=${encodeURIComponent(
    `Dzień dobry, pytam o ofertę${listingNumber ? ` nr ${listingNumber}` : ''}.`
  )}`;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-[90] md:hidden transition-transform duration-200 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-2 border-t border-black/10 bg-[var(--surface)] px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(20,18,14,0.08)]">
        <span className="font-display gold-grad mr-auto truncate text-[22px] leading-none">{price}</span>
        <a
          href={sms}
          className="rounded-xl border border-[#E9C87D] px-3.5 py-2.5 text-[15px] font-semibold !text-[var(--gold-ink)]"
        >
          SMS
        </a>
        <a
          href={`tel:${digits}`}
          className="rounded-xl bg-[#E9C87D] px-4 py-2.5 text-[15px] font-semibold !text-[#2a2117]"
        >
          Zadzwoń
        </a>
      </div>
    </div>
  );
}
