'use client';
import { useState } from 'react';
import ImagesUploader from '@/components/ImagesUploader';

const CATS = ['DOM','MIESZKANIE','DZIALKA','INNE'] as const;

type Initial = {
  title: string; category: string; price: string; area: string; location: string;
  listingNumber: string; bullets: string[]; coverImageUrl: string; images: string[];
  virtualTourUrl: string; contactPhone: string; contactEmail: string; shortDesc: string;
}

export default function EditForm({ id, initial }: { id: string; initial: Initial }) {
  const [form, setForm] = useState({
    ...initial,
    imagesText: initial.images.join('\n'), // textarea kompatybilna z API
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(`/api/admin/listings/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...form,
        images: form.imagesText, // API przyjmuje \n-separated
      }),
    });
    if (r.ok) location.href = '/admin';
    else {
      const j = await r.json().catch(() => ({} as any));
      alert(j?.error ?? 'Błąd zapisu');
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
      <input className="input" placeholder="Tytuł" value={form.title}
             onChange={e=>setForm(f=>({ ...f, title:e.target.value }))}/>
      <select className="input" value={form.category}
              onChange={e=>setForm(f=>({ ...f, category:e.target.value }))}>
        {CATS.map(c=> <option key={c}>{c}</option>)}
      </select>

      <input className="input" placeholder="Cena (PLN)" value={form.price}
             onChange={e=>setForm(f=>({ ...f, price:e.target.value }))}/>
      <input className="input" placeholder="Metraż (m²)" value={form.area}
             onChange={e=>setForm(f=>({ ...f, area:e.target.value }))}/>
      <input className="input" placeholder="Lokalizacja" value={form.location}
             onChange={e=>setForm(f=>({ ...f, location:e.target.value }))}/>
      <input className="input" placeholder="Numer oferty" value={form.listingNumber}
             onChange={e=>setForm(f=>({ ...f, listingNumber:e.target.value }))}/>

      <input className="input" placeholder="Bullet 1" value={form.bullets[0]}
             onChange={e=>setForm(f=>({ ...f, bullets:[e.target.value, f.bullets[1], f.bullets[2]] }))}/>
      <input className="input" placeholder="Bullet 2" value={form.bullets[1]}
             onChange={e=>setForm(f=>({ ...f, bullets:[f.bullets[0], e.target.value, f.bullets[2]] }))}/>
      <input className="input" placeholder="Bullet 3" value={form.bullets[2]}
             onChange={e=>setForm(f=>({ ...f, bullets:[f.bullets[0], f.bullets[1], e.target.value] }))}/>

      {/* Uploader: aktualizuje imagesText oraz coverImageUrl jeśli puste */}
      <div className="md:col-span-2">
        <ImagesUploader
          onUpload={(urls) => setForm(f => ({
            ...f,
            imagesText: urls.join('\n'),
            coverImageUrl: f.coverImageUrl || urls[0] || '',
          }))}
        />
        {/* Podgląd aktualnych obrazów */}
        {form.imagesText && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {form.imagesText.split('\n').filter(Boolean).map(u =>
              <img key={u} src={u} className="w-full h-24 object-cover rounded-lg" />
            )}
          </div>
        )}
      </div>

      <input className="input md:col-span-2" placeholder="Cover image URL" value={form.coverImageUrl}
             onChange={e=>setForm(f=>({ ...f, coverImageUrl:e.target.value }))}/>
      <textarea className="input md:col-span-2" rows={3} placeholder="Lista obrazów (po jednym URL w linii)"
                value={form.imagesText} onChange={e=>setForm(f=>({ ...f, imagesText:e.target.value }))}/>

      <input className="input" placeholder="Link do wirtualnego spaceru (opcjonalnie)" value={form.virtualTourUrl}
             onChange={e=>setForm(f=>({ ...f, virtualTourUrl:e.target.value }))}/>
      <input className="input" placeholder="Telefon" value={form.contactPhone}
             onChange={e=>setForm(f=>({ ...f, contactPhone:e.target.value }))}/>
      <input className="input" placeholder="Email" value={form.contactEmail}
             onChange={e=>setForm(f=>({ ...f, contactEmail:e.target.value }))}/>
      <textarea className="input md:col-span-2" rows={3} placeholder="Krótki opis" value={form.shortDesc}
                onChange={e=>setForm(f=>({ ...f, shortDesc:e.target.value }))}/>

      <button className="md:col-span-2 rounded-xl px-4 py-3 bg-[#E9C87D] text-black font-medium">
        Zapisz zmiany
      </button>

      <style jsx global>{`
        .input{background:#00000066;border:1px solid #ffffff1a;border-radius:12px;padding:12px 14px}
      `}</style>
    </form>
  );
}
