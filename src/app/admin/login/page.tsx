'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (r.ok) {
        window.location.href = '/admin';
        return;
      }
      setErr(r.status === 401 ? 'Nieprawidłowe hasło.' : 'Logowanie chwilowo nie działa. Spróbuj za chwilę.');
    } catch {
      setErr('Brak połączenia. Spróbuj ponownie.');
    }
    setBusy(false);
  }

  return (
    <main className="min-h-[100svh] grid place-items-center bg-[#131313] text-[#d9d9d9]">
      <form onSubmit={onSubmit} className="p-6 w-[min(420px,90vw)] rounded-2xl border border-[#E9C87D]/30">
        <h1 className="font-display text-2xl mb-4 text-[#E9C87D]">Panel M2</h1>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Hasło"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-3"
        />
        {err && <p role="alert" className="mb-3 text-sm text-red-400">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl px-4 py-3 bg-[#E9C87D] text-black font-medium disabled:opacity-60">
          {busy ? 'Loguję…' : 'Zaloguj'}
        </button>
      </form>
    </main>
  );
}
