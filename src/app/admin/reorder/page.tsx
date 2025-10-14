'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Row = {
  id: string;
  title: string;
  listingNumber: string;
  sortIndex: number;
  isReserved?: boolean;
};

export default function ReorderPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // proste DnD
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // pobieramy listę do sortowania (tylko niezbędne pola)
        const r = await fetch('/api/admin/reorder', { method: 'GET' });
        if (!r.ok) throw new Error(await r.text());
        const data = (await r.json()) as Row[];
        if (alive) {
          // posortuj po sortIndex rosnąco (asekuracyjnie)
          data.sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
          setItems(data);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || 'Nie udało się pobrać listy');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function move(draggedId: string, overId: string) {
    if (draggedId === overId) return;
    const next = items.slice();
    const from = next.findIndex((x) => x.id === draggedId);
    const to = next.findIndex((x) => x.id === overId);
    if (from < 0 || to < 0) return;
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    setItems(next);
  }

  async function saveOrder() {
    try {
      setSaving(true);
      setErr(null);
      const orderedIds = items.map((x) => x.id);
      const r = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (!r.ok) throw new Error(await r.text());
    } catch (e: any) {
      setErr(e?.message || 'Nie udało się zapisać kolejności');
      return;
    } finally {
      setSaving(false);
    }
    // po sukcesie – odśwież indeksy w pamięci (0..n)
    setItems((prev) => prev.map((x, i) => ({ ...x, sortIndex: i })));
  }

  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] p-6">
      <header className="mb-6">
        <h1 className="font-[Bungee] text-2xl text-[#E9C87D] text-center">Kolejność ofert</h1>
        <div className="mt-3 flex justify-center gap-3">
          <Link href="/admin" className="px-4 py-2 rounded-xl border border-white/10">
            Powrót
          </Link>
          <button
            onClick={saveOrder}
            disabled={saving || loading || items.length === 0}
            className="px-4 py-2 rounded-xl bg-[#E9C87D] text-black font-medium disabled:opacity-60"
          >
            {saving ? 'Zapisuję…' : 'Zapisz kolejność'}
          </button>
        </div>
      </header>

      {err && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {err}
        </div>
      )}

      {loading ? (
        <div>Ładowanie…</div>
      ) : items.length === 0 ? (
        <div>Brak ofert do ułożenia.</div>
      ) : (
        <ul className="max-w-3xl mx-auto divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden">
          {items.map((row) => (
            <li
              key={row.id}
              draggable
              onDragStart={() => setDragId(row.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) move(dragId, row.id);
                setDragId(null);
              }}
              className="flex items-center gap-3 bg-black/30 hover:bg-black/40 transition px-4 py-3 select-none cursor-grab"
              title="Przeciągnij, aby zmienić kolejność"
            >
              <span className="text-[#E9C87D] w-10 text-center font-mono">
                {items.findIndex((x) => x.id === row.id) + 1}
              </span>
              <span className="opacity-70 w-24">#{row.listingNumber}</span>
              <span className="flex-1">{row.title}</span>
              {row.isReserved && (
                <span className="text-xs px-2 py-0.5 rounded bg-[#E9C87D] text-black">REZERWACJA</span>
              )}
              <span className="opacity-50 text-xs w-16 text-right">idx {row.sortIndex ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
