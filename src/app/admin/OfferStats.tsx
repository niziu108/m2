'use client';
import { useEffect, useState } from 'react';

type Stats = { total: number; bySource: Record<string, number> };
type Props = { listingId: string; days?: number; compact?: boolean };

export default function OfferStats({ listingId, days = 90, compact = false }: Props) {
  const [data, setData] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/views/${listingId}?days=${days}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((d) => {
        if (alive) setData({ total: d.total, bySource: d.bySource || {} });
      })
      .catch((e) => {
        if (alive) setErr(e.message || 'error');
      });
    return () => {
      alive = false;
    };
  }, [listingId, days]);

  // Separator + odstępy żeby NIC nie nachodziło na przyciski:
  const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-2 pt-2 mb-2 border-t border-white/10">{children}</div>
  );

  if (err) return <Wrap><div className="text-xs text-red-400/80">stat: {err}</div></Wrap>;
  if (!data) return <Wrap><div className="text-xs opacity-60">Ładuję statystyki…</div></Wrap>;

  const internal = data.bySource?.INTERNAL ?? 0;
  const external = data.bySource?.EXTERNAL ?? 0;
  const unknown  = data.bySource?.UNKNOWN  ?? 0;

  if (compact) {
    // Jedna elegancka pastylka (kompakt)
    return (
      <Wrap>
        <div className="inline-flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5">
          <span className="opacity-80">👁 Odsłony:</span>
          <b>{data.total}</b>
          <span className="opacity-60">• wew:</span>
          <b>{internal}</b>
          <span className="opacity-60">• link:</span>
          <b>{external}</b>
          {unknown > 0 && (
            <>
              <span className="opacity-60">• inne:</span>
              <b>{unknown}</b>
            </>
          )}
        </div>
      </Wrap>
    );
  }

  // Klasyczne badge’y (domyślne)
  return (
    <Wrap>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5">
          Odsłony: <b>{data.total}</b>
        </span>
        <span className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5">
          Ze strony: <b>{internal}</b>
        </span>
        <span className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5">
          Z linka: <b>{external}</b>
        </span>
        {unknown > 0 && (
          <span className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/5 opacity-80">
            Inne: <b>{unknown}</b>
          </span>
        )}
      </div>
    </Wrap>
  );
}
