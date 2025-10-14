'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

/* Ikony SVG (białe) */
function IconInstagram({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="white" stroke="none" />
    </svg>
  );
}

function IconFacebook({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.2" />
      <path d="M13 10h2.5M13 10v-2c0-1 .7-1.5 1.7-1.5H16M13 10h-1.6V20" />
    </svg>
  );
}

/* NOWA IKONA – YOUTUBE (dopasowana rozmiarem) */
function IconYouTube({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="white"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.2" />
      <polygon points="10,8.5 10,15.5 16,12" fill="white" stroke="none" />
    </svg>
  );
}

/* Pomocniczy: fade-up z opóźnieniem */
function FadeUp({
  show,
  delay = 0,
  className = '',
  children,
}: {
  show: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'transition-all duration-700 ease-out will-change-transform',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Kontakt() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.unobserve(el); // tylko raz
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = useMemo(
    () => [
      { text: 'KONTAKT:', delay: 0, highlight: true },
      { text: 'tel. 605 071 605', delay: 120 },
      { text: 'mail: biuro@m2.nieruchomosci.pl', delay: 220 },
      { text: 'MEDIA SPOŁECZNOŚCIOWE:', delay: 380, highlight: true },
    ],
    []
  );

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      aria-label="Sekcja kontaktowa"
      className="
        relative w-full h-[100svh] overflow-hidden bg-[#131313] text-[#d9d9d9]
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
          mx-auto h-full w-full max-w-7xl
          flex flex-col items-center justify-center gap-8 px-5 lg:px-8
          lg:grid lg:grid-cols-2 lg:items-center lg:gap-12
        "
      >
        {/* LEWO */}
        <div className="order-1 font-bungee tracking-tight w-full break-words">
          {/* Nagłówek „KONTAKT:” */}
          <FadeUp show={inView} delay={lines[0].delay}>
            <div
              className="
                text-[#E9C87D]
                text-[clamp(22px,8.2vw,52px)] lg:text-[clamp(28px,4.2vw,48px)]
                max-[380px]:text-[clamp(20px,7.6vw,36px)]
                leading-[1.04]
              "
            >
              KONTAKT:
            </div>
          </FadeUp>

          {/* Telefon */}
          <FadeUp show={inView} delay={lines[1].delay}>
            <div
              className="
                mt-3
                text-[clamp(15px,4.2vw,30px)] lg:text-[clamp(18px,2.2vw,28px)]
                max-[380px]:text-[clamp(14px,3.9vw,20px)]
              "
            >
              tel. 605 071 605
            </div>
          </FadeUp>

          {/* Mail */}
          <FadeUp show={inView} delay={lines[2].delay}>
            <div
              className="
                mt-2
                text-[clamp(14px,3.9vw,26px)] lg:text-[clamp(16px,2vw,24px)]
                max-[380px]:text-[clamp(13px,3.6vw,19px)]
              "
            >
              mail: biuro@m2.nieruchomosci.pl
            </div>
          </FadeUp>

          {/* MEDIA SPOŁECZNOŚCIOWE */}
          <FadeUp show={inView} delay={lines[3].delay}>
            <div
              className="
                mt-8 lg:mt-12
                text-[#E9C87D]
                text-[clamp(22px,8.2vw,52px)] lg:text-[clamp(28px,4.2vw,48px)]
                max-[380px]:text-[clamp(20px,7.6vw,36px)]
                leading-[1.04]
              "
            >
              MEDIA SPOŁECZNOŚCIOWE:
            </div>
          </FadeUp>

          {/* IKONY */}
          <FadeUp show={inView} delay={lines[3].delay + 120}>
            <div className="mt-3 flex items-center gap-6 text-white">
              <a
                href="https://www.instagram.com/m2.nieruchomosci_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram M2 Nieruchomości"
                className="transition-transform hover:scale-[1.08] active:scale-[0.98]"
              >
                <IconInstagram className="w-[42px] h-[42px] lg:w-[40px] lg:h-[40px] max-[380px]:w-[34px] max-[380px]:h-[34px]" />
              </a>

              <a
                href="https://www.facebook.com/M2.posrednik/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook M2 Nieruchomości"
                className="transition-transform hover:scale-[1.08] active:scale-[0.98]"
              >
                <IconFacebook className="w-[42px] h-[42px] lg:w-[40px] lg:h-[40px] max-[380px]:w-[34px] max-[380px]:h-[34px]" />
              </a>

              <a
                href="https://www.youtube.com/@M2_Nieruchomo%C5%9Bci"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube M2 Nieruchomości"
                className="transition-transform hover:scale-[1.08] active:scale-[0.98] hover:[&>svg>rect]:fill-[#FF0000]/80"
              >
                <IconYouTube className="w-[42px] h-[42px] lg:w-[40px] lg:h-[40px] max-[380px]:w-[34px] max-[380px]:h-[34px]" />
              </a>
            </div>
          </FadeUp>

          <div className="sr-only">
            <a href="tel:+48605071605">Zadzwoń: 605 071 605</a>
            <a href="mailto:biuro@m2.nieruchomosci.pl">Napisz: biuro@m2.nieruchomosci.pl</a>
          </div>
        </div>

        {/* PRAWO – obrazek, też wjeżdża z dołu */}
        <FadeUp show={inView} delay={200} className="order-2 w-full flex items-center justify-center">
          <div className="relative w-full max-w-[560px] lg:max-w-[720px] aspect-[4/3] lg:aspect-[5/4]">
            <Image
              src="/kontakt.png"
              alt="Kontakt – ilustracja"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
