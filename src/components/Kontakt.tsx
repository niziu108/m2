'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

/* Ikony SVG (białe) */
function IconInstagram({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill="none" stroke="#26231e" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="#26231e" stroke="none" />
    </svg>
  );
}

function IconFacebook({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill="none" stroke="#26231e" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.2" />
      <path d="M13 10h2.5M13 10v-2c0-1 .7-1.5 1.7-1.5H16M13 10h-1.6V20" />
    </svg>
  );
}

/* NOWA IKONA – YOUTUBE */
function IconYouTube({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="#26231e"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.2" />
      <polygon points="10,8.5 10,15.5 16,12" fill="#26231e" stroke="none" />
    </svg>
  );
}

/* Animacja FadeUp */
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
          io.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = useMemo(
    () => [
      { text: 'Kontakt', delay: 0, highlight: true },
      { text: '605 071 605', delay: 120 },
      { text: '661 099 666', delay: 180 },
      { text: 'biuro@m2.nieruchomosci.pl', delay: 260 },
      { text: 'Media społecznościowe', delay: 380, highlight: true },
    ],
    []
  );

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      aria-label="Sekcja kontaktowa"
      className="
        relative w-full lg:min-h-[100svh] py-16 lg:py-10 overflow-hidden bg-[var(--background)] text-[var(--foreground)]
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
      "
    >
      <div
        className="
          mx-auto h-full lg:min-h-[inherit] w-full max-w-7xl
          flex flex-col items-center justify-center gap-8 px-5 lg:px-16
          lg:grid lg:grid-cols-2 lg:items-center lg:gap-12
        "
      >
        {/* LEWA STRONA */}
        <div className="order-1 w-full break-words">
          {/* Nagłówek */}
          <FadeUp show={inView} delay={lines[0].delay}>
            <span className="eyebrow">Kontakt</span>
            <div className="section-title mt-3">Porozmawiajmy o Twojej nieruchomości</div>
            <span className="gold-rule mt-5" aria-hidden />
          </FadeUp>

          {/* Telefon 1 */}
          <FadeUp show={inView} delay={lines[1].delay}>
            <div
              className="
                mt-7 font-display
                text-[clamp(26px,6.4vw,38px)]
              "
            >
              <a
                href="tel:+48605071605"
                style={{ color: '#23201b' }}
                className="hover:!text-[var(--accent-deep)] focus:!text-[var(--accent-deep)] transition-colors"
              >
                605 071 605
              </a>
            </div>
          </FadeUp>

          {/* Telefon 2 */}
          <FadeUp show={inView} delay={lines[2].delay}>
            <div
              className="
                mt-1 font-display
                text-[clamp(26px,6.4vw,38px)]
              "
            >
              <a
                href="tel:+48661099666"
                style={{ color: '#23201b' }}
                className="hover:!text-[var(--accent-deep)] focus:!text-[var(--accent-deep)] transition-colors"
              >
                661 099 666
              </a>
            </div>
          </FadeUp>

          {/* Mail */}
          <FadeUp show={inView} delay={lines[3].delay}>
            <div
              className="
                mt-3
                text-[clamp(15px,4vw,19px)]
              "
            >
              <a
                href="mailto:biuro@m2.nieruchomosci.pl"
                style={{ color: '#23201b' }}
                className="hover:!text-[var(--accent-deep)] focus:!text-[var(--accent-deep)] transition-colors"
              >
                biuro@m2.nieruchomosci.pl
              </a>
            </div>
          </FadeUp>

          {/* MEDIA SPOŁECZNOŚCIOWE */}
          <FadeUp show={inView} delay={lines[4].delay}>
            <span className="eyebrow mt-10 lg:mt-12">Media społecznościowe</span>
          </FadeUp>

          {/* IKONY */}
          <FadeUp show={inView} delay={lines[4].delay + 120}>
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
        </div>

        {/* PRAWA STRONA */}
        <FadeUp show={inView} delay={200} className="order-2 w-full flex items-center justify-center">
          <div className="relative w-full max-w-[560px] lg:max-w-[720px] aspect-[4/3] lg:aspect-[5/4]">
            <Image
              src="/kontakt-dark.png"
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