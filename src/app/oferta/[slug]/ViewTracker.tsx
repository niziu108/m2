'use client';

import { useEffect } from 'react';
import { navState } from '@/components/NavProgress';

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    // Statystyki to ludzie na żywej stronie: bez testów lokalnych (ta sama baza) i bez botów
    if (['localhost', '127.0.0.1'].includes(location.hostname)) return;
    // bot jako osobne słowo („Googlebot/2.1”), bo telefony Cubot też mają „bot” w nazwie
    if (/(?:bot|crawler|spider)[/;\s)]|lighthouse/i.test(navigator.userAgent)) return;

    const controller = new AbortController();
    const t = setTimeout(() => {
      // Nagłówek referer tego zapytania to sama oferta, a document.referrer po kliknięciu linku na stronie
      // zostaje taki, jak przy wejściu na witrynę (Google albo pusto). Dlatego przejście po stronie sprawdzamy osobno.
      const referrer = navState.internal ? location.origin : document.referrer;
      fetch('/api/views', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ listingId, referrer }),
        keepalive: true,
        signal: controller.signal,
      }).catch(() => {});
    }, 1000);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [listingId]);

  return null;
}