'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import ActionButtons from './ActionButtons'

export type AdminItem = {
  id: string
  title: string
  category: string
  listingNumber: string
  area: number | null
  price: number
  isReserved: boolean
}

export default function DraggableGrid({ initialItems }: { initialItems: AdminItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [dragId, setDragId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function onDragStart(id: string) {
    setDragId(id)
  }
  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault()
    if (!dragId || dragId === overId) return
    const cur = items.slice()
    const from = cur.findIndex(i => i.id === dragId)
    const to = cur.findIndex(i => i.id === overId)
    if (from === -1 || to === -1) return
    const [moved] = cur.splice(from, 1)
    cur.splice(to, 0, moved)
    setItems(cur)
  }
  function onDragEnd() {
    setDragId(null)
  }

  const payload = useMemo(
    () => items.map((i, idx) => ({ id: i.id, order: idx })), // 0,1,2...
    [items]
  )

  async function saveOrder() {
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!r.ok) throw new Error(await r.text())
      setMsg('✅ Kolejność zapisana')
      // (opcjonalnie) odśwież SSR po zapisie:
      // location.reload()
    } catch (e: any) {
      setMsg('❌ Nie udało się zapisać kolejności')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 2500)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={saveOrder}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#E9C87D] text-black font-medium disabled:opacity-60"
        >
          {saving ? 'Zapisuję…' : 'Zapisz kolejność'}
        </button>
      </div>
      {msg && <div className="text-center text-sm opacity-80">{msg}</div>}

      <ul className="grid md:grid-cols-3 gap-6">
        {items.map((i) => (
          <li
            key={i.id}
            draggable
            onDragStart={() => onDragStart(i.id)}
            onDragOver={(e) => onDragOver(e, i.id)}
            onDragEnd={onDragEnd}
            className={[
              'rounded-2xl border border-white/10 p-4 bg-black/30 cursor-grab',
              dragId === i.id ? 'opacity-60' : ''
            ].join(' ')}
            title="Przeciągnij, aby zmienić kolejność"
          >
            <div className="text-sm opacity-70 mb-1">
              {i.category}{i.isReserved ? ' • REZERWACJA' : ''}
            </div>

            <div className="text-lg font-medium text-[#E9C87D] mb-1">
              {i.title}
            </div>

            <div className="text-sm opacity-70 mb-3">
              #{i.listingNumber} • {i.area ?? '-'} m² • {i.price.toLocaleString('pl-PL')} zł
            </div>

            <ActionButtons id={i.id} isReserved={i.isReserved} />

            <div className="mt-3">
              <Link
                href={`/admin/edit/${i.id}`}
                className="block text-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                ✏️ Edytuj
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
