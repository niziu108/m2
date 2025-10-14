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
    <form onSubmit={onSubmit} className={`grid gap-4 ${isPending ? 'opacity-80 pointer-events-none' : ''}`}>
      {/* Numer oferty */}
      <input
        className="input rounded-none"
        name="q"
        placeholder="Numer oferty"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
      />

      {/* LOKALIZACJA */}
      <div className="relative" ref={sugRef}>
        <input
          ref={inputRef}
          className="input rounded-none w-full"
          placeholder="Lokalizacja (np. Bełchatów, ulica...)"
          value={loc}
          onChange={(e)=>{ setLoc(e.target.value); setOpenSug(true); }}
          onFocus={()=>{ if (!suppressNextSugRef.current && loc) setOpenSug(true); }}
        />
        {openSug && hits.length>0 && (
          <div className="absolute z-50 mt-1 w-full bg-[#1b1b1b] border border-[#ffffff1a] rounded-md max-h-64 overflow-auto">
            {hits.map((h, i)=>(
              <button
                type="button"
                key={i}
                onMouseDown={(e)=>{ e.preventDefault(); pickHit(h); }}   // one-click desktop
                onTouchStart={(e)=>{ e.preventDefault(); pickHit(h); }}  // one-touch mobile
                className="block w-full text-left px-3 py-2 hover:bg-white/5"
              >
                {h.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRZYCISKI PROMIENIA */}
      <div className="flex flex-wrap gap-2">
        {radiusChoices.map(val => {
          const active = r===val;
          return (
            <button
              type="button"
              key={val}
              onClick={()=>{
                // jeśli właśnie wybrano podpowiedź LUB dropdown jest otwarty – ignoruj ten klik
                if (blockRadiusClickRef.current || openSug) return;
                setR(active ? 0 : val);
              }}
              className={`h-9 px-3 rounded-md border ${active ? 'bg-[#E9C87D] text-black' : 'text-[#ffffff1]'}`}
              style={{ borderColor: '#E9C87D' }}
              title={active ? 'Wyłącz' : `Ustaw ${val} km`}
            >
              +{val} km
            </button>
          )
        })}
      </div>

      {/* CENA */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Cena: {pMin.toLocaleString('pl-PL')} zł</span>
          <span>{pMax.toLocaleString('pl-PL')} zł</span>
        </div>
        <div className="relative h-8">
          <div className="absolute left:0 right:0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#E9C87D]"
            style={{
              left: `${((pMin - safe.pmin) / (safe.pmax - safe.pmin)) * 100}%`,
              right:`${100 - ((pMax - safe.pmin) / (safe.pmax - safe.pmin)) * 100}%`,
            }}
          />
          <input type="range" min={safe.pmin} max={safe.pmax} value={pMin}
                 onChange={(e)=>setPMin(parseInt(e.target.value))} className="range"/>
          <input type="range" min={safe.pmin} max={safe.pmax} value={pMax}
                 onChange={(e)=>setPMax(parseInt(e.target.value))} className="range"/>
        </div>
      </div>

      {/* METRAŻ */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Metraż: {aMin} m²</span>
          <span>{aMax} m²</span>
        </div>
        <div className="relative h-8">
          <div className="absolute left:0 right:0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#E9C87D]"
            style={{
              left: `${((aMin - safe.amin) / (safe.amax - safe.amin)) * 100}%`,
              right:`${100 - ((aMax - safe.amin) / (safe.amax - safe.amin)) * 100}%`,
            }}
          />
          <input type="range" min={safe.amin} max={safe.amax} value={aMin}
                 onChange={(e)=>setAMin(parseInt(e.target.value))} className="range"/>
          <input type="range" min={safe.amin} max={safe.amax} value={aMax}
                 onChange={(e)=>setAMax(parseInt(e.target.value))} className="range"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="h-12 rounded-none px-4 bg-[#E9C87D] text-black font-medium">Filtruj</button>
        <button type="button" onClick={onReset} className="h-12 rounded-none px-4 bg-black/40 border border-white/10">
          Wyczyść
        </button>
      </div>

      <style jsx global>{`
        .input{background:#00000066;border:1px solid #ffffff1a;padding:12px 14px;width:100%}
        .range{
          -webkit-appearance:none;appearance:none;
          position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);
          background:transparent;height:0;
          pointer-events:none;
          accent-color:#E9C87D;outline:none;
        }
        .range::-webkit-slider-thumb{
          -webkit-appearance:none;appearance:none;
          width:18px;height:18px;border-radius:9999px;background:#E9C87D;border:2px solid #1a1a1a;
          cursor:pointer;position:relative;z-index:10;
          pointer-events:auto;
        }
        .range::-moz-range-thumb{
          width:18px;height:18px;border-radius:9999px;background:#E9C87D;border:2px solid #1a1a1a;cursor:pointer;
          pointer-events:auto;
        }
        .range::-webkit-slider-thumb:active { cursor:grabbing; }
      `}</style>
    </form>
  );
}