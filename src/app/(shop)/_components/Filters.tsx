'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Limits = {
  priceMin: number; priceMax: number;
  areaMin: number;  areaMax: number;
};

function clamp(n:number, min:number, max:number){ return Math.max(min, Math.min(max, n)); }
function useDebounced<T>(val:T, delay=300){
  const [v, setV] = useState(val);
  useEffect(()=>{ const t=setTimeout(()=>setV(val), delay); return ()=>clearTimeout(t); },[val,delay]);
  return v;
}

type NomHit = { display_name:string; lat:string; lon:string; type?:string; class?:string };

/** ZAWSZE 10 km – niezależnie od typu wyniku */
function smartDefaultKm(_: { type?: string; class?: string } | null | undefined): number {
  return 10;
}

export default function Filters({
  defaults,
  limits,
}:{
  defaults: Record<string,string|undefined>,
  limits: Limits
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const safe = useMemo(() => {
    const pmin = Number.isFinite(limits.priceMin) ? limits.priceMin : 0;
    const pmax = Number.isFinite(limits.priceMax) && limits.priceMax>0 ? limits.priceMax : (pmin || 1);
    const amin = Number.isFinite(limits.areaMin)  ? limits.areaMin  : 0;
    const amax = Number.isFinite(limits.areaMax)  && limits.areaMax>0 ? limits.areaMax  : (amin || 1);
    return { pmin, pmax, amin, amax };
  }, [limits]);

  // pola
  const [q, setQ] = useState(defaults.q || '');
  const [pMin, setPMin] = useState<number>(() =>
    clamp(parseInt(defaults.pmin || ''), safe.pmin, safe.pmax) || safe.pmin
  );
  const [pMax, setPMax] = useState<number>(() =>
    clamp(parseInt(defaults.pmax || ''), safe.pmin, safe.pmax) || safe.pmax
  );
  const [aMin, setAMin] = useState<number>(() =>
    clamp(parseInt(defaults.amin || ''), safe.amin, safe.amax) || safe.amin
  );
  const [aMax, setAMax] = useState<number>(() =>
    clamp(parseInt(defaults.amax || ''), safe.amin, safe.amax) || safe.amax
  );

  const [loc, setLoc]   = useState(defaults.loc || '');
  const [lat, setLat]   = useState<number | null>(() => defaults.lat ? Number(defaults.lat) : null);
  const [lng, setLng]   = useState<number | null>(() => defaults.lng ? Number(defaults.lng) : null);
  const [r, setR]       = useState<number>(() => defaults.r ? Number(defaults.r) : 0);
  const metaRef = useRef<{ type?: string; class?: string } | null>(null);

  // autosugestia
  const [openSug, setOpenSug] = useState(false);
  const [hits, setHits] = useState<NomHit[]>([]);
  const debLoc = useDebounced(loc, 250);
  const sugRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔒 flaga: zgaś jedno następne odświeżenie sugestii (po picku)
  const suppressNextSugRef = useRef(false);

  // 🔒 flaga: krótko blokujemy kliki w przyciski promienia po wyborze podpowiedzi
  const blockRadiusClickRef = useRef(false);

  useEffect(()=>{ if (pMin > pMax) setPMin(pMax); },[pMin,pMax]);
  useEffect(()=>{ if (aMin > aMax) setAMin(aMax); },[aMin,aMax]);
  useEffect(()=>{
    setPMin(v=>clamp(v, safe.pmin, safe.pmax));
    setPMax(v=>clamp(v, safe.pmin, safe.pmax));
    setAMin(v=>clamp(v, safe.amin, safe.amax));
    setAMax(v=>clamp(v, safe.amin, safe.amax));
  }, [safe]);

  // autosugestia OSM (PL)
  useEffect(()=>{
    let alive = true;

    if (suppressNextSugRef.current) {
      suppressNextSugRef.current = false;
      return;
    }

    (async ()=>{
      const txt = (debLoc || '').trim();
      if (txt.length < 1){ setHits([]); return; }
      try{
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=pl&q=${encodeURIComponent(txt)}`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'pl', 'User-Agent': 'm2-nieruchomosci/1.0' }});
        const arr = (await res.json()) as NomHit[];
        if (!alive) return;
        const rank = (h: NomHit)=> {
          const t = String(h.type||'').toLowerCase();
          if (t==='city'||t==='town') return 0;
          if (t==='suburb'||t==='neighbourhood') return 1;
          if (t==='village'||t==='hamlet') return 2;
          return 3;
        };
        (arr||[]).sort((a,b)=>rank(a)-rank(b));
        setHits(arr || []);
        setOpenSug(true);
      }catch{
        if (!alive) return;
        setHits([]);
      }
    })();
    return ()=>{ alive = false; };
  }, [debLoc]);

  useEffect(()=>{
    function onDoc(e:MouseEvent){
      if (!sugRef.current) return;
      if (!sugRef.current.contains(e.target as Node)) setOpenSug(false);
    }
    document.addEventListener('click', onDoc);
    return ()=>document.removeEventListener('click', onDoc);
  },[]);

  function pickHit(h: NomHit){
    // zamknij dropdown + nie odświeżaj go jednorazowo
    setOpenSug(false);
    suppressNextSugRef.current = true;

    // ustaw wartości
    setLoc(h.display_name);
    setLat(Number(h.lat)||null);
    setLng(Number(h.lon)||null);
    metaRef.current = { type: h.type, class: h.class };
    setR(prev => prev>0 ? prev : smartDefaultKm(metaRef.current)); // 10 km

    // zgaś focus, by dropdown nie wrócił
    inputRef.current?.blur();

    // ⛑️ blokada przypadkowego kliknięcia w „+km” pod spodem (350 ms)
    blockRadiusClickRef.current = true;
    setTimeout(()=>{ blockRadiusClickRef.current = false; }, 350);
  }

  async function geocodeIfMissing(): Promise<void>{
    if (lat!=null && lng!=null) return;
    const t = (loc||'').trim();
    if (!t) return;
    try{
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pl&q=${encodeURIComponent(t)}`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'pl', 'User-Agent': 'm2-nieruchomosci/1.0' }});
      const arr = await res.json();
      if (Array.isArray(arr) && arr[0]){
        setLat(Number(arr[0].lat)||null);
        setLng(Number(arr[0].lon)||null);
        setR(prev => prev>0 ? prev : 10);
      }
    }catch{}
  }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    await geocodeIfMissing();

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (pMin > safe.pmin) params.set('pmin', String(pMin));
    if (pMax < safe.pmax) params.set('pmax', String(pMax));
    if (aMin > safe.amin) params.set('amin', String(aMin));
    if (aMax < safe.amax) params.set('amax', String(aMax));

    if (lat!=null && lng!=null){
      const effR = r>0 ? r : smartDefaultKm(metaRef.current); // 10
      params.set('lat', String(lat));
      params.set('lng', String(lng));
      params.set('r', String(effR));
    }
    if (loc) params.set('loc', loc);

    startTransition(()=>{
      router.replace(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
    });
  }

  function onReset(){
    startTransition(()=>{
      setQ('');
      setPMin(safe.pmin); setPMax(safe.pmax);
      setAMin(safe.amin); setAMax(safe.amax);
      setLoc(''); setLat(null); setLng(null); setR(0);
      router.replace(pathname, { scroll: false });
    });
  }

  const radiusChoices = [10, 20, 30, 40];

  return (
    <form onSubmit={onSubmit} className={isPending ? 'opacity-80 pointer-events-none' : ''}>
      <div className="flt-card grid gap-5">
        {/* LOKALIZACJA */}
        <div className="relative" ref={sugRef}>
          <label className="flt-lbl">Lokalizacja</label>
          <input
            ref={inputRef}
            className="flt-input"
            placeholder="np. Bełchatów, ulica…"
            value={loc}
            onChange={(e)=>{ setLoc(e.target.value); setOpenSug(true); }}
            onFocus={()=>{ if (!suppressNextSugRef.current && loc) setOpenSug(true); }}
          />
          {openSug && hits.length>0 && (
            <div className="flt-sug">
              {hits.map((h, i)=>(
                <button
                  type="button"
                  key={i}
                  onMouseDown={(e)=>{ e.preventDefault(); pickHit(h); }}
                  onTouchStart={(e)=>{ e.preventDefault(); pickHit(h); }}
                  className="flt-sug-item"
                >
                  {h.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PROMIEŃ */}
        <div>
          <label className="flt-lbl">Promień od lokalizacji</label>
          <div className="flex flex-wrap gap-2">
            {radiusChoices.map(val => {
              const active = r===val;
              return (
                <button
                  type="button"
                  key={val}
                  onClick={()=>{
                    if (blockRadiusClickRef.current || openSug) return;
                    setR(active ? 0 : val);
                  }}
                  className={`flt-pill ${active ? 'is-active' : ''}`}
                  title={active ? 'Wyłącz' : `Ustaw ${val} km`}
                >
                  {val} km
                </button>
              )
            })}
          </div>
        </div>

        {/* CENA + METRAŻ */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="flt-lbl">Cena (zł)</label>
            <div className="flt-pair">
              <input
                type="number" inputMode="numeric" className="flt-input"
                placeholder={`od ${safe.pmin.toLocaleString('pl-PL')}`}
                min={safe.pmin} max={safe.pmax}
                value={pMin > safe.pmin ? pMin : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setPMin(v === '' ? safe.pmin : clamp(parseInt(v) || safe.pmin, safe.pmin, safe.pmax));
                }}
              />
              <span className="flt-dash">–</span>
              <input
                type="number" inputMode="numeric" className="flt-input"
                placeholder={`do ${safe.pmax.toLocaleString('pl-PL')}`}
                min={safe.pmin} max={safe.pmax}
                value={pMax < safe.pmax ? pMax : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setPMax(v === '' ? safe.pmax : clamp(parseInt(v) || safe.pmax, safe.pmin, safe.pmax));
                }}
              />
            </div>
          </div>

          <div>
            <label className="flt-lbl">Metraż (m²)</label>
            <div className="flt-pair">
              <input
                type="number" inputMode="numeric" className="flt-input"
                placeholder={`od ${safe.amin}`}
                min={safe.amin} max={safe.amax}
                value={aMin > safe.amin ? aMin : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setAMin(v === '' ? safe.amin : clamp(parseInt(v) || safe.amin, safe.amin, safe.amax));
                }}
              />
              <span className="flt-dash">–</span>
              <input
                type="number" inputMode="numeric" className="flt-input"
                placeholder={`do ${safe.amax}`}
                min={safe.amin} max={safe.amax}
                value={aMax < safe.amax ? aMax : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setAMax(v === '' ? safe.amax : clamp(parseInt(v) || safe.amax, safe.amin, safe.amax));
                }}
              />
            </div>
          </div>
        </div>

        {/* NUMER OFERTY */}
        <div>
          <label className="flt-lbl">Numer oferty</label>
          <input
            className="flt-input"
            name="q"
            placeholder="np. D19"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
        </div>

        {/* AKCJE */}
        <div className="flex gap-3 pt-1">
          <button type="submit" className="flt-btn-primary flex-1 sm:flex-none">Szukaj</button>
          <button type="button" onClick={onReset} className="flt-btn-ghost">Wyczyść</button>
        </div>
      </div>

      <style jsx global>{`
        .flt-card{
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(20,18,14,.06);
        }
        @media (min-width:640px){ .flt-card{ padding:26px } }

        .flt-lbl{
          display:block; font-size:11px; letter-spacing:.16em; text-transform:uppercase;
          color: var(--foreground-soft); margin-bottom:8px;
        }
        .flt-input{
          width:100%; background:#ffffff;
          border:1px solid var(--line); border-radius:12px;
          padding:13px 15px; font-size:16px; color: var(--foreground);
          transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }
        .flt-input::placeholder{ color:#9a958c }
        .flt-input:focus{
          outline:none; border-color:#c8951a; background:rgba(233,200,125,.08);
          box-shadow:0 0 0 3px rgba(233,200,125,.28);
        }
        .flt-input::-webkit-outer-spin-button,
        .flt-input::-webkit-inner-spin-button{ -webkit-appearance:none; margin:0 }
        .flt-pair{ display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px }
        .flt-dash{ color:#9a958c; text-align:center }

        .flt-pill{
          height:40px; padding:0 16px; border-radius:999px; font-size:13px;
          border:1px solid var(--line); color: var(--foreground-soft); background:transparent;
          transition:all .18s ease; cursor:pointer;
        }
        .flt-pill:hover{ border-color:#c8951a; color: var(--foreground) }
        .flt-pill.is-active{ background:#E9C87D; color:#2a2117; border-color:#E9C87D; font-weight:600 }

        .flt-btn-primary{
          height:50px; padding:0 26px; border-radius:12px; background:#E9C87D; color:#2a2117;
          font-weight:600; letter-spacing:.02em; transition:transform .12s ease, filter .2s ease;
        }
        .flt-btn-primary:hover{ filter:brightness(1.03) }
        .flt-btn-primary:active{ transform:scale(.98) }
        .flt-btn-ghost{
          height:50px; padding:0 20px; border-radius:12px; background:transparent;
          border:1px solid var(--line); color: var(--foreground-soft);
          transition:border-color .2s ease, color .2s ease;
        }
        .flt-btn-ghost:hover{ border-color:#c8951a; color: var(--foreground) }

        .flt-sug{
          position:absolute; z-index:50; margin-top:6px; width:100%;
          background:#ffffff; border:1px solid var(--line); border-radius:12px;
          max-height:260px; overflow:auto; box-shadow:0 14px 34px rgba(20,18,14,.16);
        }
        .flt-sug-item{
          display:block; width:100%; text-align:left; padding:11px 14px; font-size:14px; color: var(--foreground);
          transition:background .15s ease;
        }
        .flt-sug-item:hover{ background:rgba(20,18,14,.05) }
      `}</style>
    </form>
  );
}