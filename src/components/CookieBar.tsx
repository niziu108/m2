'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import FbPixel from './FbPixel';

const LS_ACCEPT_KEY = 'cookie-accepted-v2';
const SS_DISMISS_KEY = 'cookie-dismissed-session-v2';

declare global {
  interface Window {
    cookieConsent?: {
      reset: () => void;
      forceShow: () => void;
    };
  }
}

export default function CookieBar() {
  const [visible, setVisible] = useState(false);
  // Zgodą jest tylko kliknięcie „Akceptuję”. Krzyżyk i samoczynne zniknięcie paska po 15 s nią nie są.
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

  const closeForSession = () => {
    try { sessionStorage.setItem(SS_DISMISS_KEY, 'true'); } catch {}
    setVisible(false);
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
          <div className="mx-auto max-w-6xl px-3 sm:px-6 py-2 flex items-center gap-3 sm:gap-4">
            <p className="flex-1 text-[12px] sm:text-[13px] leading-snug text-center sm:text-left">
              Ta strona korzysta z plików cookie w celu poprawy działania i analizy ruchu. Więcej w&nbsp;
              <Link
                href="/polityka-prywatnosci"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 !text-[#E9C87D]"
              >
                Polityce prywatności
              </Link>.
            </p>

            <button
              onClick={accept}
              className="h-8 px-3 rounded-md text-[12px] font-medium hover:opacity-90 transition"
              style={{ background: '#fbfaf5', color: '#131313' }}
            >
              Akceptuję
            </button>

            <button
              onClick={closeForSession}
              aria-label="Zamknij pasek cookies"
              title="Zamknij"
              className="h-8 w-8 grid place-items-center text-[20px] hover:opacity-70"
              style={{ color: '#fbfaf5' }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
