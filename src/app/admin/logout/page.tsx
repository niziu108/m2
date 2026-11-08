'use client'
import { useEffect, useState } from 'react'

export default function Logout() {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // Ciasteczko jest HttpOnly, więc skasować je może tylko serwer.
    fetch('/api/auth/logout', { method: 'POST' })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        location.href = '/admin/login'
      })
      .catch(() => setFailed(true))
  }, [])

  if (!failed) return null
  return (
    <main className="min-h-[100svh] grid place-items-center bg-[#131313] text-[#d9d9d9] p-6 text-center">
      Nie udało się wylogować. Sprawdź internet i odśwież tę stronę.
    </main>
  )
}
