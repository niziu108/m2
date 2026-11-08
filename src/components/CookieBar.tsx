'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import FbPixel from './FbPixel';

// v3: pasek wymienia piksel Facebooka. Zgoda na wcześniejszy tekst go nie obejmowała, więc pytamy od nowa.
const LS_ACCEPT_KEY = 'cookie-accepted-v3';
const SS_DISMISS_KEY = 'cookie-dismissed-session-v3';

declare global {
  interface Window {
    cookieConsent?: {
      reset: () => void;
      forceShow: () => void;
    };
  }
}

/** Cookie piksela leżą na domenie strony, więc przy cofnięciu zgody usuwamy je sami. */
function removeFbCookies() {
  const parts = location.hostname.split('.');
  for (const name of ['_fbp', '_fbc']) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`;
    }
  }
}

export default function CookieBar() {
  const [visible, setVisible] = useState(false);
  // Zgodą jest tylko kliknięcie „Akceptuję”. „Odrzuć” i samoczynne zniknięcie paska po 15 s nią nie są.
  const [consented, setConsented] = useState(false);

  // ?debugCookies=1 -> pokaż zawsze (pomijamy stan w LS/SS)
  const debug = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debugCookies') === '1';
  }, []);

  useEffect(() => {
    // helpery do konsoli
    window.cookieConsent = {
      reset() {
        try {
          localStorage.removeItem(LS_ACCEPT_KEY);
          sessionStorage.removeItem(SS_DISMISS_KEY);
        } catch {}
        removeFbCookies();
        location.reload();
      },
      forceShow() {
        try { sessionStorage.removeItem(SS_DISMISS_KEY); } catch {}
        setVisible(true);
      },
    };

    try {
      const accepted = localStorage.getItem(LS_ACCEPT_KEY) === 'true';
      const dismissed = sessionStorage.getItem(SS_DISMISS_KEY) === 'true';

      if (accepted) setConsented(true);

      if (debug || (!accepted && !dismissed)) {
        setVisible(true);

        // auto-hide po 15s (tylko jeśli nie kliknięto „Akceptuję”)
        const t = setTimeout(() => {
          try { sessionStorage.setItem(SS_DISMISS_KEY, 'true'); } catch {}
          setVisible(false);
        }, 15000);

        return () => clearTimeout(t);
      }
    } catch {
      // jeżeli storage wysypał się – pokaż pasek
      setVisible(true);
    }
  }, [debug]);

  const accept = () => {
    try { localStorage.setItem(LS_ACCEPT_KEY, 'true'); } catch {}
    setVisible(false);
    setConsented(true);
  };

  const reject = () => {
    try { sessionStorage.setItem(SS_DISMISS_KEY, 'true'); } catch {}
    setVisible(false);

    // Cofnięcie wcześniejszej zgody („Ustawienia cookies” w stopce): piksel już działa, więc sprzątamy
    // po nim i przeładowujemy stronę, żeby przestał cokolwiek wysyłać.
    if (consented) {
      try { localStorage.removeItem(LS_ACCEPT_KEY); } catch {}
      removeFbCookies();
      location.reload();
    }
  };

  return (
    <>
      {consented && <FbPixel />}

      {visible && (
        <div
          className="fixed inset-x-0 bottom-0 z-[2147483647] border-t"
          style={{ background: '#131313', color: '#fbfaf5', borderColor: 'rgba(251,250,245,.2)' }}
          role="dialog"
          aria-label="Informacja o plikach cookie"
          aria-live="polite"
        >
          <div className="mx-auto max-w-6xl px-3 sm:px-6 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="flex-1 text-[12px] sm:text-[13px] leading-snug text-center sm:text-left">
              Za Twoją zgodą używamy plików cookie i piksela Facebooka (Meta) do pomiaru ruchu i reklam.
              Bez zgody strona działa tak samo. Więcej w&nbsp;
              <Link
                href="/polityka-prywatnosci#cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 !text-[#E9C87D]"
              >
                Polityce prywatności
              </Link>.
            </p>

            {/* Oba wybory są tak samo duże i tak samo łatwe: odmowa nie może być ukryta. */}
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="h-9 flex-1 sm:flex-none px-4 rounded-md text-[13px] font-medium hover:opacity-90 transition"
                style={{ background: '#fbfaf5', color: '#131313' }}
              >
                Akceptuję
              </button>

              <button
                onClick={reject}
                className="h-9 flex-1 sm:flex-none px-4 rounded-md border text-[13px] font-medium hover:opacity-80 transition"
                style={{ color: '#fbfaf5', borderColor: 'rgba(251,250,245,.55)' }}
              >
                Odrzuć
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
