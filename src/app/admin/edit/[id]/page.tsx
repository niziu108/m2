// src/app/admin/edit/[id]/page.tsx
'use client';
import { useEffect, useMemo, useRef, useState, useEffect as useEffect2 } from 'react';
import Link from 'next/link';

/* ----------------------------- TYPY ----------------------------- */
type Listing = {
  id: string;
  title: string;
  category: 'DOM' | 'MIESZKANIE' | 'DZIALKA' | 'INNE';
  price: number;
  area: number | null;
  location: string | null;  // KRÓTKA etykieta
  lat: number | null;       // GEO
  lng: number | null;       // GEO
  listingNumber: string;
  isReserved: boolean;
  bullets: string[];
  coverImageUrl: string | null;
  virtualTourUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  shortDesc: string | null;
  body: string | null;
  images: { id: string; url: string; order: number }[];
};

const CATS = ['DOM', 'MIESZKANIE', 'DZIALKA', 'INNE'] as const;

/* ----------------------------- CLOUDINARY ----------------------------- */
const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUD_NAME;
const unsignedPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_UNSIGNED_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  if (!cloudName || !unsignedPreset)
    throw new Error('Brak NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME/UPLOAD_PRESET (lub aliasów)');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', unsignedPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'Upload failed');
  return json.secure_url as string;
}

/* ----------------------------- GEOKODOWANIE ----------------------------- */
async function geocodePL(q: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pl&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'pl', 'User-Agent': 'm2-nieruchomosci/1.0' } });
  const arr = await res.json();
  const hit = Array.isArray(arr) && arr[0];
  if (!hit) throw new Error('Nie znaleziono lokalizacji');
  return { lat: Number(hit.lat), lng: Number(hit.lon), display_name: String(hit.display_name || '') };
}

/* ----------------------------- AUTOSUGESTIA OSM ----------------------------- */
function OSMInput({
  onPick,
}: {
  onPick: (hit: { display_name: string; lat: string; lon: string }) => void;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q || q.length < 2) { setHits([]); return; }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=pl&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'pl' } }
        );
        const arr = await res.json();
        setHits(arr);
        setOpen(true);
      } catch {
        setHits([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="space-y-2">
      <div className="text-sm opacity-80">Szukaj miejsca (OSM) — ustawia tylko współrzędne</div>
      <div className="relative" ref={ref}>
        <input
          className="input"
          placeholder="np. Bełchatów, ulica, dzielnica..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {open && hits.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-[#1b1b1b] border border-[#ffffff1a] rounded-md max-h-64 overflow-auto">
            {hits.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { onPick(h); setOpen(false); }}
                className="block w-full text-left px-3 py-2 hover:bg-white/5"
              >
                {h.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- PODGLĄD FORMATOWANIA ----------------------------- */
function renderMarkup(src: string) {
  let html = (src || '').replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const blocks = html.split(/\n{2,}/);
  const rendered = blocks.map((block) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => l.trim() === '' || l.trim().startsWith('- '));
    if (isList) {
      const lis = lines.filter((l) => l.trim().length).map((l) => `<li>${l.replace(/^\s*-\s*/, '')}</li>`).join('');
      return `<ul class="list-disc ml-6">${lis}</ul>`;
    }
    return `<p>${lines.join('<br/>')}</p>`;
  });
  html = rendered.join('');
  html = html
    .replace(/\[\[gold\]\]/g, '<span class="mk-gold">')
    .replace(/\[\[\/gold\]\]/g, '</span>')
    .replace(/\[\[center\]\]/g, '<div class="mk-center">')
    .replace(/\[\[\/center\]\]/g, '</div>')
    .replace(/\[\[bold\]\]/g, '<strong>')
    .replace(/\[\[\/bold\]\]/g, '</strong>');
  return html;
}

function wrapSelection(textarea: HTMLTextAreaElement, openTag: string, closeTag: string) {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const val = textarea.value ?? '';
  const before = val.slice(0, start);
  const sel = val.slice(start, end);
  const after = val.slice(end);
  const next = before + openTag + sel + closeTag + after;
  textarea.value = next;
  const newPos = start + openTag.length + sel.length + closeTag.length;
  textarea.selectionStart = textarea.selectionEnd = newPos;
  textarea.focus();
  return next;
}

/* ----------------------------- STRONA EDYCJI ----------------------------- */
export default function EditPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<Listing | null>(null);
  const [osmPickedName, setOsmPickedName] = useState<string | null>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const r = await fetch(`/api/admin/listings/${params.id}`);
      if (!r.ok) { setErr('Nie udało się pobrać oferty'); setLoading(false); return; }
      const j = await r.json();
      if (alive) { setForm(j); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  const previewHTML = useMemo(() => renderMarkup(form?.shortDesc || ''), [form?.shortDesc]);

  if (loading || !form) return <main className="p-6 text-[#d9d9d9]">Ładowanie…</main>;

  const images = form.images?.map((i) => i.url) ?? [];

  async function save() {
    try {
      setSaving(true);
      setErr(undefined);

      const payload = {
        id: form.id,
        title: form.title,
        category: form.category,
        price: form.price,
        area: form.area,
        location: form.location,  // KRÓTKA etykieta
        lat: form.lat,
        lng: form.lng,
        listingNumber: form.listingNumber,
        isReserved: form.isReserved,
        bullets: Array.isArray(form.bullets) ? form.bullets.slice(0, 1) : [],
        coverImageUrl: form.coverImageUrl,
        virtualTourUrl: form.virtualTourUrl,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        shortDesc: form.shortDesc,
        body: form.body,
        images,
      };

      const r = await fetch(`/api/admin/listings/${form.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error((await r.text()) || 'Błąd zapisu');
      location.href = '/admin';
    } catch (e: any) {
      setErr(e.message || 'Błąd zapisu');
    } finally {
      setSaving(false);
    }
  }

  function shortFromDisplayName(name: string) {
    const parts = name.split(',').map(s => s.trim());
    if (!parts.length) return name;
    return parts.slice(0, 2).join(', ');
  }

  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] p-6">
      <header className="mb-6 text-center">
        <h1 className="font-[Bungee] text-2xl text-[#E9C87D]">Edycja oferty</h1>
        <div className="mt-3 flex justify-center gap-3">
          <Link href="/admin" className="px-4 py-2 rounded-xl border border-white/10">Powrót</Link>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-[#E9C87D] text-black font-medium disabled:opacity-60">
            {saving ? 'Zapisuję…' : 'Zapisz'}
          </button>
        </div>
      </header>

      {err && <div className="mb-4 text-red-400">{err}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEWA */}
        <section className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" placeholder="Tytuł" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Listing['category'] })}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>

            <input className="input" placeholder="Cena (PLN)" inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })} />
            <input className="input" placeholder="Metraż (m²)" inputMode="numeric" value={form.area ?? ''} onChange={(e) => setForm({ ...form, area: e.target.value ? Number(e.target.value) : null })} />

            {/* Lokalizacja — KRÓTKA etykieta do wyświetlania */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm opacity-80">Lokalizacja (krótka etykieta, wyświetlana na karcie/ofercie)</label>
              <input
                className="input"
                placeholder="np. Bełchatów, os. Binków"
                value={form.location ?? ''}
                onChange={(e) => setForm({ ...form, location: e.target.value || null })}
              />

              {/* AUTOSUGESTIA (tylko GEO) */}
              <OSMInput
                onPick={(hit) => {
                  setForm({ ...form, lat: Number(hit.lat) || null, lng: Number(hit.lon) || null });
                  setOsmPickedName(hit.display_name || null);
                }}
              />

              {/* Przyciski */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-white/10"
                  onClick={async () => {
                    try {
                      if (!form.location) throw new Error('Wpisz najpierw lokalizację (krótką etykietę)');
                      const { lat, lng } = await geocodePL(form.location);
                      setForm({ ...form, lat, lng });
                      alert(`Znaleziono: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                    } catch (e: any) {
                      alert(e?.message || 'Nie udało się ustalić współrzędnych');
                    }
                  }}
                >
                  📍 Geokoduj z etykiety
                </button>

                {osmPickedName && (
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border border-white/10"
                    onClick={() => setForm({ ...form, location: shortFromDisplayName(osmPickedName) })}
                  >
                    Użyj krótkiej nazwy z OSM
                  </button>
                )}
              </div>

              {/* Współrzędne */}
              <div className="grid grid-cols-2 gap-2">
                <input className="input" placeholder="Szerokość geogr. (lat)" value={form.lat ?? ''} onChange={(e) => setForm({ ...form, lat: e.target.value ? Number(e.target.value) : null })} />
                <input className="input" placeholder="Długość geogr. (lng)" value={form.lng ?? ''} onChange={(e) => setForm({ ...form, lng: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>

            <input className="input" placeholder="Numer oferty" value={form.listingNumber} onChange={(e) => setForm({ ...form, listingNumber: e.target.value })} />
            <input className="input md:col-span-2" placeholder="Bullet 1" value={form.bullets?.[0] ?? ''} onChange={(e) => setForm({ ...form, bullets: [e.target.value] })} />

            {/* Wirtualny spacer */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm opacity-80">Wirtualny spacer (np. Matterport / link 360°)</label>
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="https://my.matterport.com/show/?m=..." value={form.virtualTourUrl ?? ''} onChange={(e) => setForm({ ...form, virtualTourUrl: e.target.value.trim() || null })} />
                {form.virtualTourUrl ? (
                  <a href={form.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl border border-white/10 whitespace-nowrap">Podgląd</a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Okładka */}
          <div className="space-y-2">
            <label className="block text-sm opacity-80">Okładka (Cover)</label>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-lg border border-white/10" onClick={async () => {
                const inp = document.createElement('input');
                inp.type = 'file'; inp.accept = 'image/*';
                inp.onchange = async () => { const f = inp.files?.[0]; if (!f) return; const url = await uploadToCloudinary(f); setForm({ ...form, coverImageUrl: url }); };
                inp.click();
              }}>Wybierz plik</button>
              {form.coverImageUrl && <img src={form.coverImageUrl} alt="" className="h-12 rounded-md border border-white/10" />}
            </div>
          </div>

          {/* Galeria */}
          <div className="space-y-2">
            <label className="block text-sm opacity-80">Galeria (wiele zdjęć)</label>
            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-2 rounded-lg border border-white/10" onClick={async () => {
                const inp = document.createElement('input');
                inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
                inp.onchange = async () => {
                  const files = Array.from(inp.files || []);
                  const urls: string[] = [];
                  for (const f of files) {
                    const url = await uploadToCloudinary(f);
                    urls.push(url);
                  }
                  const merged = [...images, ...urls].map((u, idx) => ({ id: String(idx), url: u, order: idx }));
                  setForm({ ...form, images: merged as any });
                };
                inp.click();
              }}>Dodaj zdjęcia</button>

              {images.map((u, idx) => (
                <div key={u + idx} className="relative">
                  <img src={u} className="h-12 w-12 object-cover rounded-md border border-white/10" />
                  <button className="absolute -top-2 -right-2 bg-black/70 rounded-full px-1"
                    onClick={() => {
                      const arr = images.slice();
                      arr.splice(idx, 1);
                      setForm({ ...form, images: arr.map((x, i) => ({ id: String(i), url: x, order: i })) as any });
                    }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRAWA */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="opacity-80">Krótki opis</span>

            <button type="button" className="btn-gold" onClick={() => {
              const ta = descRef.current; if (!ta) return;
              const next = wrapSelection(ta, '[[gold]]', '[[/gold]]');
              setForm((f) => (f ? { ...f, shortDesc: next } : f));
            }}>Złoty Bungee</button>

            <button type="button" className="btn-dark" onClick={() => {
              const ta = descRef.current; if (!ta) return;
              const next = wrapSelection(ta, '[[center]]', '[[/center]]');
              setForm((f) => (f ? { ...f, shortDesc: next } : f));
            }}>Wyśrodkuj</button>

            <button type="button" className="btn-dark" onClick={() => {
              const ta = descRef.current; if (!ta) return;
              const next = wrapSelection(ta, '- ', '');
              setForm((f) => (f ? { ...f, shortDesc: next } : f));
            }}>Lista</button>

            <button type="button" className="btn-dark" onClick={() => {
              const ta = descRef.current; if (!ta) return;
              const next = wrapSelection(ta, '[[bold]]', '[[/bold]]');
              setForm((f) => (f ? { ...f, shortDesc: next } : f));
            }}>Pogrub</button>

            <button type="button" className="btn-dark" onClick={() => setForm({ ...form, shortDesc: '' })}>Wyczyść</button>
          </div>

          <textarea
            ref={descRef}
            value={form.shortDesc ?? ''}
            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            className="w-full min-h-[420px] bg-black/60 border border-white/10 rounded-xl p-4 font-mono"
            placeholder="Piszesz normalny tekst. Używaj przycisków (gold/center/lista/pogrub). Enter = nowa linia."
          />

          {/* Kontakt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Telefon (np. 605 071 605)" value={form.contactPhone ?? ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value || null })} />
            <input className="input" type="email" placeholder="E-mail (np. biuro@firma.pl)" value={form.contactEmail ?? ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value || null })} />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm opacity-70 mb-2">Podgląd:</div>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewHTML }} />
          </div>
        </section>
      </div>

      <style jsx>{`
        .input{ background:#00000066; border:1px solid #ffffff1a; border-radius:12px; padding:12px 14px; width:100% }
        .btn-gold{ background:#E9C87D; color:#000; border-radius:10px; padding:8px 12px }
        .btn-dark{ background:#00000066; border:1px solid #ffffff1a; border-radius:10px; padding:8px 12px }
        .mk-gold{ color:#E9C87D; font-family:Bungee, system-ui, sans-serif }
        .mk-center{ text-align:center }
        .prose :global(ul){ margin:0; padding:0 }
        .prose :global(li){ margin:4px 0 }
      `}</style>
    </main>
  );
}
