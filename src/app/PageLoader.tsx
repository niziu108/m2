// src/app/PageLoader.tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * Globalny page loader
 * - pokazuje logo.webp na ciemnym tle #131313
 * - używa maski (mask-image) jeśli przeglądarka wspiera, wtedy wypełnia kolorem
 * - preloader trzyma min. 2s i chowa się płynnie po pełnym załadowaniu strony
 */
export default function PageLoader() {
  const [supportsMask, setSupportsMask] = useState<boolean | null>(null);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // 1) wykrycie wsparcia dla mask-image
    try {
      const ok =
        (window as any).CSS?.supports?.('mask-image', 'url("/logo.webp")') ||
        (window as any).CSS?.supports?.('-webkit-mask-image', 'url("/logo.webp")') ||
        false;
      setSupportsMask(!!ok);
    } catch {
      setSupportsMask(false);
    }

    // 2) minimalny czas widoczności (żeby nie migało)
    const t = setTimeout(() => setMinTimeDone(true), 2000);

    // 3) event pełnego załadowania strony
    const markLoaded = () => setPageLoaded(true);
    if (document.readyState === 'complete') {
      markLoaded();
    } else {
      window.addEventListener('load', markLoaded, { once: true });
    }

    // 4) preload grafiki
    const img = new Image();
    img.src = '/logo.webp';

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', markLoaded);
    };
  }, []);

  // chowamy overlay kiedy minął minimalny czas i strona się już załadowała
  useEffect(() => {
    if (minTimeDone && pageLoaded) {
      setHidden(true);
      const t = setTimeout(() => {
        const el = document.getElementById('page-loader-root');
        if (el) el.style.display = 'none';
      }, 300); // spójne z transition-opacity
      return () => clearTimeout(t);
    }
  }, [minTimeDone, pageLoaded]);

  const readyToShowLogo = supportsMask !== null;

  return (
    <div
      id="page-loader-root"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-[#131313] transition-opacity duration-300 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {readyToShowLogo ? (
        supportsMask ? (
          // Wersja z maską – wypełnienie kolorem (złoty brand)
          <div
            aria-hidden="true"
            className="animate-breathe will-change-transform"
            style={{
              width: 260,
              height: 260,
              backgroundColor: '#E9C87D', // kolor wypełnienia maski (złoty)
              WebkitMaskImage: 'url("/logo.webp")',
              maskImage: 'url("/logo.webp")',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        ) : (
          // Fallback: zwykły <img>, lekko "wybielony", by pasował do stylu
          <img
            src="/logo.webp"
            alt="Logo"
            width={260}
            height={260}
            className="animate-breathe select-none"
            draggable={false}
            style={{
              filter:
                'brightness(0) invert(84%) sepia(35%) saturate(408%) hue-rotate(356deg)', // zbliżone do złota
            }}
          />
        )
      ) : null}

      <style jsx global>{`
        @keyframes breathe {
          0% { transform: scale(1); opacity: 0.96; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 0.96; }
        }
        .animate-breathe {
          animation: breathe 1.6s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
