'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [pwd, setPwd] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    document.cookie = `m2_admin=${pwd}; path=/; SameSite=Lax`;
    window.location.href = '/admin';
  }

  return (
    <main className="min-h-[100svh] grid place-items-center bg-[#131313] text-[#d9d9d9]">
      <form onSubmit={onSubmit} className="p-6 w-[min(420px,90vw)] rounded-2xl border border-[#E9C87D]/30">
        <h1 className="font-[Bungee] text-2xl mb-4 text-[#E9C87D]">Panel M2</h1>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Hasło"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-3"
        />
        <button className="w-full rounded-xl px-4 py-3 bg-[#E9C87D] text-black font-medium">Zaloguj</button>
      </form>
    </main>
  );
}
