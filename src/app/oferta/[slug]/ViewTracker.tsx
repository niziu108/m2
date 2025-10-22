'use client';

import { useEffect } from 'react';

export default function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const controller = new AbortController();
    const t = setTimeout(() => {
      fetch('/api/views', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ listingId }),
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