'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ActionButtons({
  id,
  isReserved,
}: {
  id: string;
  isReserved: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState(isReserved);

  async function toggleReservation() {
    // optymistycznie od razu przełącz
    setLocal((v) => !v);

    const res = await fetch(`/api/admin/listings/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        isReserved: !local,
        patchMode: 'flagOnly', // <<< ważne
      }),
    });

    if (!res.ok) {
      // cofnij optymistyczną zmianę, gdyby się nie udało
      setLocal((v) => !v);
      const txt = await res.text();
      alert(`Nie udało się zmienić rezerwacji:\n${txt || res.status}`);
      return;
    }

    // odśwież listę
    startTransition(() => router.refresh());
  }

  async function remove() {
    if (!confirm('Na pewno usunąć ofertę?')) return;
    const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Nie udało się usunąć');
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleReservation}
        disabled={pending}
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        {local ? 'Odwołaj rezerwację' : 'Rezerwacja'}
      </button>
      <button
        onClick={remove}
        disabled={pending}
        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        Usuń
      </button>
    </div>
  );
}
